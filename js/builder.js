/**
 * PC BUILDER - Motor Lógico del Constructor y Motor de Compatibilidad
 * Administra el estado actual del ensamble, validaciones de hardware y guardado en localStorage.
 */

class PCBuilderEngine {
    constructor() {
        this.STORAGE_KEY_CURRENT = 'pc_builder_draft_v1';
        this.STORAGE_KEY_SAVED = 'pc_builder_saved_builds_v1';
        
        // Estado inicial vacío con todas las categorías
        this.currentBuild = {
            cpu: null,
            motherboard: null,
            gpu: null,
            ram: null,
            storage: null,
            cooler: null,
            psu: null,
            case: null
        };

        this.init();
    }

    /**
     * Inicializa el estado cargando el borrador guardado en localStorage si existe
     */
    init() {
        try {
            const savedDraft = localStorage.getItem(this.STORAGE_KEY_CURRENT);
            if (savedDraft) {
                const parsedDraft = JSON.parse(savedDraft);
                // Mapear IDs a objetos completos de la base de datos
                Object.keys(this.currentBuild).forEach(category => {
                    if (parsedDraft[category]) {
                        const component = COMPONENTS_DATABASE.find(c => c.id === parsedDraft[category]);
                        if (component) {
                            this.currentBuild[category] = component;
                        }
                    }
                });
            }
        } catch (e) {
            console.warn('Error al recuperar borrador del constructor:', e);
        }
    }

    /**
     * Guarda el borrador actual en localStorage
     */
    persistDraft() {
        try {
            const draftIds = {};
            Object.keys(this.currentBuild).forEach(category => {
                draftIds[category] = this.currentBuild[category] ? this.currentBuild[category].id : null;
            });
            localStorage.setItem(this.STORAGE_KEY_CURRENT, JSON.stringify(draftIds));
        } catch (e) {
            console.error('Error al persistir borrador:', e);
        }
    }

    /**
     * Selecciona y asigna un componente por su ID
     */
    selectComponent(componentId) {
        const component = COMPONENTS_DATABASE.find(c => c.id === componentId);
        if (!component) return false;

        this.currentBuild[component.category] = component;
        this.persistDraft();
        return true;
    }

    /**
     * Quita un componente por su categoría
     */
    removeComponent(categoryKey) {
        if (this.currentBuild[categoryKey] !== undefined) {
            this.currentBuild[categoryKey] = null;
            this.persistDraft();
            return true;
        }
        return false;
    }

    /**
     * Vacía toda la configuración actual
     */
    clearBuild() {
        Object.keys(this.currentBuild).forEach(k => {
            this.currentBuild[k] = null;
        });
        this.persistDraft();
    }

    /**
     * Carga un preset predefinido
     */
    loadPreset(presetId) {
        const preset = PRESET_BUILDS.find(p => p.id === presetId);
        if (!preset) return false;

        this.clearBuild();
        Object.entries(preset.components).forEach(([category, compId]) => {
            const comp = COMPONENTS_DATABASE.find(c => c.id === compId);
            if (comp) {
                this.currentBuild[category] = comp;
            }
        });

        this.persistDraft();
        return true;
    }

    /**
     * Retorna la cantidad de componentes seleccionados
     */
    getSelectedCount() {
        return Object.values(this.currentBuild).filter(item => item !== null).length;
    }

    /**
     * Calcula el precio total actual de los componentes elegidos
     */
    calculateTotalPrice() {
        return Object.values(this.currentBuild).reduce((total, comp) => {
            return total + (comp ? comp.price : 0);
        }, 0);
    }

    /**
     * Formatea un número en formato moneda USD
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    }

    /**
     * Calcula el consumo estimado en Watts (TDP estimado)
     */
    calculateEstimatedWattage() {
        let wattage = 0;
        const cpu = this.currentBuild.cpu;
        const gpu = this.currentBuild.gpu;

        // Base del sistema (placa madre, ventiladores, chipset, RAM, SSD)
        if (this.getSelectedCount() > 0) {
            wattage += 80;
        }

        if (cpu && cpu.tdp) {
            wattage += cpu.tdp;
        }

        if (gpu && gpu.tdp) {
            wattage += gpu.tdp;
        }

        return wattage;
    }

    /**
     * MOTOR DE COMPATIBILIDAD
     * Analiza las reglas de hardware y retorna advertencias o errores
     */
    checkCompatibility() {
        const issues = [];
        const { cpu, motherboard, gpu, ram, storage, cooler, psu, case: pcCase } = this.currentBuild;

        // 1. REGLA: CPU vs Placa Madre (Socket)
        if (cpu && motherboard) {
            if (cpu.socket !== motherboard.socket) {
                issues.push({
                    type: 'error',
                    title: 'Incompatibilidad de Socket (CPU y Placa Madre)',
                    message: `El procesador "${cpu.name}" requiere socket ${cpu.socket}, pero la placa madre "${motherboard.name}" tiene socket ${motherboard.socket}. Físicamente no encajarán.`
                });
            }
        }

        // 2. REGLA: Memoria RAM vs Placa Madre (Tipo de RAM: DDR4 vs DDR5)
        if (ram && motherboard) {
            if (ram.ramType !== motherboard.ramType) {
                issues.push({
                    type: 'error',
                    title: 'Incompatibilidad de Memoria RAM',
                    message: `La placa madre "${motherboard.name}" requiere módulos ${motherboard.ramType}, pero seleccionaste memoria "${ram.name}" (${ram.ramType}). Las ranuras tienen muescas diferentes.`
                });
            }
        }

        // 3. REGLA: CPU vs Tipo de Memoria RAM
        if (cpu && ram) {
            if (cpu.supportedRam && !cpu.supportedRam.includes(ram.ramType)) {
                issues.push({
                    type: 'error',
                    title: 'RAM no soportada por el Procesador',
                    message: `El procesador "${cpu.name}" solo soporta memorias ${cpu.supportedRam.join('/')}, pero seleccionaste ${ram.ramType}.`
                });
            }
        }

        // 4. REGLA: Refrigeración vs Socket de CPU
        if (cooler && cpu) {
            if (cooler.supportedSockets && !cooler.supportedSockets.includes(cpu.socket)) {
                issues.push({
                    type: 'warning',
                    title: 'Soporte de Socket en el Disipador',
                    message: `El disipador "${cooler.name}" no lista soporte nativo para el socket ${cpu.socket}. Podrías requerir un soporte de montaje especial.`
                });
            }
        }

        // 5. REGLA: Gabinete vs Formato de Placa Madre (ATX, Micro-ATX, etc.)
        if (motherboard && pcCase) {
            if (pcCase.supportedMotherboards && !pcCase.supportedMotherboards.includes(motherboard.formFactor)) {
                issues.push({
                    type: 'error',
                    title: 'Placa Madre Demasiado Grande para el Gabinete',
                    message: `La placa madre "${motherboard.name}" es formato ${motherboard.formFactor}, pero el gabinete "${pcCase.name}" solo admite placas ${pcCase.supportedMotherboards.join(', ')}.`
                });
            }
        }

        // 6. REGLA: Tarjeta Gráfica vs Longitud Máxima en Gabinete
        if (gpu && pcCase) {
            if (gpu.length && pcCase.maxGpuLength && gpu.length > pcCase.maxGpuLength) {
                issues.push({
                    type: 'error',
                    title: 'GPU no cabe en el Gabinete',
                    message: `La tarjeta gráfica "${gpu.name}" mide ${gpu.length}mm, pero el gabinete solo admite tarjetas de hasta ${pcCase.maxGpuLength}mm.`
                });
            }
        }

        // 7. REGLA: Fuente de Poder vs Consumo Total / GPU Recomendado
        const estimatedWattage = this.calculateEstimatedWattage();
        if (psu) {
            if (gpu && gpu.recommendedPsu && psu.wattage < gpu.recommendedPsu) {
                issues.push({
                    type: 'warning',
                    title: 'Potencia de Fuente por debajo de lo Recomendado',
                    message: `La tarjeta gráfica "${gpu.name}" recomienda una fuente de al menos ${gpu.recommendedPsu}W. La fuente elegida es de ${psu.wattage}W. El sistema podría sufrir apagones durante picos de carga.`
                });
            } else if (estimatedWattage > 0 && psu.wattage < (estimatedWattage + 80)) {
                issues.push({
                    type: 'warning',
                    title: 'Fuente al límite del consumo estimado',
                    message: `El consumo estimado es de ~${estimatedWattage}W y tu fuente es de ${psu.wattage}W. Es recomendable un margen de al menos 100W a 150W extra.`
                });
            }
        }

        // 8. ADVERTENCIA: CPU sin gráficos integrados y sin GPU dedicada
        if (cpu && !cpu.integratedGpu && !gpu) {
            issues.push({
                type: 'warning',
                title: 'No hay salida de video seleccionada',
                message: `El procesador "${cpu.name}" no tiene gráficos integrados. Debes agregar una Tarjeta Gráfica dedicada para dar señal al monitor.`
            });
        }

        const hasErrors = issues.some(i => i.type === 'error');
        const hasWarnings = issues.some(i => i.type === 'warning');

        return {
            isCompatible: !hasErrors,
            hasWarnings: hasWarnings,
            hasErrors: hasErrors,
            issues: issues,
            statusLabel: hasErrors ? 'Incompatibilidad Detectada' : (hasWarnings ? 'Compatible con Advertencias' : '100% Compatible'),
            statusClass: hasErrors ? 'status-danger' : (hasWarnings ? 'status-warning' : 'status-success')
        };
    }

    /**
     * Valida si un componente candidato es compatible con la configuración actual
     */
    isComponentCompatible(candidateComponent) {
        const { cpu, motherboard, ram, case: pcCase } = this.currentBuild;

        if (candidateComponent.category === 'motherboard') {
            if (cpu && candidateComponent.socket !== cpu.socket) return false;
            if (ram && candidateComponent.ramType !== ram.ramType) return false;
            if (pcCase && !pcCase.supportedMotherboards.includes(candidateComponent.formFactor)) return false;
        }

        if (candidateComponent.category === 'cpu') {
            if (motherboard && candidateComponent.socket !== motherboard.socket) return false;
            if (ram && candidateComponent.supportedRam && !candidateComponent.supportedRam.includes(ram.ramType)) return false;
        }

        if (candidateComponent.category === 'ram') {
            if (motherboard && candidateComponent.ramType !== motherboard.ramType) return false;
            if (cpu && cpu.supportedRam && !cpu.supportedRam.includes(candidateComponent.ramType)) return false;
        }

        if (candidateComponent.category === 'case') {
            if (motherboard && !candidateComponent.supportedMotherboards.includes(motherboard.formFactor)) return false;
            if (this.currentBuild.gpu && this.currentBuild.gpu.length > candidateComponent.maxGpuLength) return false;
        }

        return true;
    }

    // ==========================================
    // SISTEMA DE GUARDADO (MIS CONFIGURACIONES)
    // ==========================================

    /**
     * Retorna todas las configuraciones guardadas en localStorage
     */
    getSavedBuilds() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY_SAVED);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Error al leer configuraciones guardadas:', e);
            return [];
        }
    }

    /**
     * Guarda la configuración actual con un nombre personalizado
     */
    saveCurrentBuild(buildName) {
        const savedBuilds = this.getSavedBuilds();
        const dateNow = new Date();

        const buildItem = {
            id: 'build-' + Date.now(),
            name: buildName.trim() || `Ensamble #${savedBuilds.length + 1}`,
            date: dateNow.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: dateNow.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            totalPrice: this.calculateTotalPrice(),
            estimatedWattage: this.calculateEstimatedWattage(),
            componentIds: {}
        };

        Object.keys(this.currentBuild).forEach(category => {
            buildItem.componentIds[category] = this.currentBuild[category] ? this.currentBuild[category].id : null;
        });

        savedBuilds.unshift(buildItem); // Agregar al inicio
        localStorage.setItem(this.STORAGE_KEY_SAVED, JSON.stringify(savedBuilds));
        return buildItem;
    }

    /**
     * Carga una configuración guardada al constructor
     */
    loadSavedBuild(buildId) {
        const savedBuilds = this.getSavedBuilds();
        const targetBuild = savedBuilds.find(b => b.id === buildId);
        if (!targetBuild) return false;

        this.clearBuild();
        Object.entries(targetBuild.componentIds).forEach(([cat, compId]) => {
            if (compId) {
                const comp = COMPONENTS_DATABASE.find(c => c.id === compId);
                if (comp) {
                    this.currentBuild[cat] = comp;
                }
            }
        });

        this.persistDraft();
        return true;
    }

    /**
     * Elimina una configuración guardada
     */
    deleteSavedBuild(buildId) {
        const savedBuilds = this.getSavedBuilds();
        const updated = savedBuilds.filter(b => b.id !== buildId);
        localStorage.setItem(this.STORAGE_KEY_SAVED, JSON.stringify(updated));
        return true;
    }

    /**
     * Exporta el ensamble actual en texto legible para portapapeles o archivo
     */
    exportBuildText() {
        let text = `=====================================\n`;
        text += `        PC BUILDER - RESUMEN         \n`;
        text += `=====================================\n\n`;

        Object.entries(this.currentBuild).forEach(([catKey, comp]) => {
            const cat = CATEGORIES[catKey];
            if (comp) {
                text += `[${cat.shortName.toUpperCase()}]\n`;
                text += `• ${comp.name}\n`;
                text += `  Specs: ${comp.specs}\n`;
                text += `  Precio: ${this.formatCurrency(comp.price)}\n\n`;
            } else {
                text += `[${cat.shortName.toUpperCase()}]: No seleccionado\n\n`;
            }
        });

        const total = this.calculateTotalPrice();
        const wattage = this.calculateEstimatedWattage();
        const compCheck = this.checkCompatibility();

        text += `-------------------------------------\n`;
        text += `ESTADO: ${compCheck.statusLabel.toUpperCase()}\n`;
        text += `POTENCIA ESTIMADA: ~${wattage} Watts\n`;
        text += `PRECIO TOTAL: ${this.formatCurrency(total)}\n`;
        text += `=====================================\n`;
        text += `Generado por PC BUILDER - Rig Platform\n`;

        return text;
    }
}

// Instancia global
const pcBuilder = new PCBuilderEngine();

