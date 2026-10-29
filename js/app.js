/**
 * PC BUILDER - Controlador Principal de la Aplicación (SPA)
 * Gestiona el enrutamiento, renderizado de UI y eventos del usuario.
 */

/* ==========================================================================
   SISTEMA DE ENRUTAMIENTO SPA (Single Page Application)
   ========================================================================== */

/** Muestra solo la sección cuyo data-view coincide con `viewName` */
function navigateTo(viewName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    // Mostrar la sección objetivo
    const target = document.getElementById('view-' + viewName);
    if (target) target.classList.add('active');

    // Actualizar estado activo del nav
    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.dataset.view === viewName);
    });

    // Cerrar menú móvil si estaba abierto
    document.getElementById('main-nav').classList.remove('mobile-open');

    // Ejecutar callbacks específicos de cada vista
    if (viewName === 'components') renderCatalogGrid();
    if (viewName === 'saved') renderSavedBuildsGrid();
    if (viewName === 'builder') renderBuilderSlots();
    if (viewName === 'home') renderPresets();

    // Actualizar URL hash para compartibilidad
    history.pushState({ view: viewName }, '', '#' + viewName);
}

/** Lee el hash de la URL para cargar la vista correcta al inicio */
function initRouter() {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash);

    window.addEventListener('popstate', (e) => {
        const view = (e.state && e.state.view) ? e.state.view : 'home';
        navigateTo(view);
    });
}

/* ==========================================================================
   SISTEMA DE TOASTS (NOTIFICACIONES)
   ========================================================================== */
function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');

    const ICONS = {
        success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
        warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
        error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
        info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${ICONS[type]}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 320);
    }, duration);
}

/* ==========================================================================
   SISTEMA DE MODALES GENÉRICO
   ========================================================================== */
function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
}

/** Cierra un modal al hacer clic en el overlay fuera de la ventana */
function initModalOverlayClose(modalId) {
    const overlay = document.getElementById(modalId);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(modalId);
    });
}

/* ==========================================================================
   MODAL DE CONFIRMACIÓN REUTILIZABLE
   ========================================================================== */
let _confirmCallback = null;

function showConfirm(title, message, onConfirm, confirmLabel = 'Confirmar') {
    _confirmCallback = onConfirm;
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    document.getElementById('modal-confirm-btn').textContent = confirmLabel;
    openModal('modal-confirm-action');
}

/* ==========================================================================
   1. SECCIÓN INICIO – PRESETS RECOMENDADOS
   ========================================================================== */
function renderPresets() {
    const container = document.getElementById('presets-container');
    if (!container) return;

    const BADGE_CLASSES = { 0: 'badge-green', 1: 'badge-blue', 2: 'badge-purple' };

    container.innerHTML = PRESET_BUILDS.map((preset, idx) => {
        // Construir lista de componentes clave para previsualizar
        const keyParts = [
            { cat: 'cpu', label: 'CPU' },
            { cat: 'gpu', label: 'GPU' },
            { cat: 'ram', label: 'RAM' },
            { cat: 'storage', label: 'Disco' }
        ];

        const specsHTML = keyParts.map(({ cat, label }) => {
            const compId = preset.components[cat];
            const comp = COMPONENTS_DATABASE.find(c => c.id === compId);
            if (!comp) return '';
            return `
                <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <strong style="color:#94a3b8;">${label}:</strong>&nbsp;${comp.name}
                </li>`;
        }).join('');

        return `
        <div class="preset-card">
            <div>
                <div class="preset-header">
                    <h3>${preset.title}</h3>
                    <span class="badge ${BADGE_CLASSES[idx] || 'badge-blue'}">${preset.badge}</span>
                </div>
                <p class="preset-desc">${preset.description}</p>
                <ul class="preset-specs-list">${specsHTML}</ul>
            </div>
            <div class="preset-footer">
                <div>
                    <div class="preset-price-label">Precio Est.</div>
                    <div class="preset-price-val">$${preset.totalPrice.toFixed(2)}</div>
                </div>
                <button class="btn btn-primary btn-sm" onclick="loadPresetAndGoBuilder('${preset.id}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Usar Preset
                </button>
            </div>
        </div>`;
    }).join('');
}

/** Carga un preset en el builder y navega a esa sección */
function loadPresetAndGoBuilder(presetId) {
    const ok = pcBuilder.loadPreset(presetId);
    if (ok) {
        navigateTo('builder');
        renderBuilderSlots();
        updateBuilderSummary();
        showToast('Preset cargado. Modifica los componentes a tu gusto.', 'success');
    }
}

/* ==========================================================================
   2. SECCIÓN PC BUILDER – RANURAS DE COMPONENTES
   ========================================================================== */

/** Renderiza las 8 tarjetas de ranuras (slots) en el constructor */
function renderBuilderSlots() {
    const container = document.getElementById('builder-slots');
    if (!container) return;

    const categoryOrder = ['cpu', 'motherboard', 'gpu', 'ram', 'storage', 'cooler', 'psu', 'case'];

    container.innerHTML = categoryOrder.map(catKey => {
        const catInfo = CATEGORIES[catKey];
        const selected = pcBuilder.currentBuild[catKey];

        if (selected) {
            // Slot CON componente seleccionado
            return `
            <div class="component-slot-card has-component" id="slot-${catKey}">
                <div class="slot-left">
                    <div class="slot-category-icon">
                        <img src="${catInfo.icon}" alt="${catInfo.name}">
                    </div>
                    <div class="slot-meta">
                        <div class="slot-category-title">${catInfo.shortName}</div>
                        <div class="slot-component-name">${selected.name}</div>
                        <div class="slot-specs-pill">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                            ${selected.specs}
                        </div>
                    </div>
                </div>
                <div class="slot-right">
                    <div class="slot-price">
                        <div class="slot-price-amount">${pcBuilder.formatCurrency(selected.price)}</div>
                    </div>
                    <div class="slot-actions">
                        <button class="btn btn-secondary btn-sm" onclick="openSelectModal('${catKey}')" title="Cambiar componente">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Cambiar
                        </button>
                        <button class="btn btn-danger btn-icon" onclick="removeSlotComponent('${catKey}')" title="Quitar componente">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                </div>
            </div>`;
        } else {
            // Slot VACÍO (sin componente)
            return `
            <div class="component-slot-card" id="slot-${catKey}">
                <div class="slot-left">
                    <div class="slot-category-icon">
                        <img src="${catInfo.icon}" alt="${catInfo.name}">
                    </div>
                    <div class="slot-meta">
                        <div class="slot-category-title">${catInfo.shortName}</div>
                        <div class="slot-empty-text">${catInfo.description}</div>
                    </div>
                </div>
                <div class="slot-right">
                    <div class="slot-actions">
                        <button class="btn btn-primary btn-sm" onclick="openSelectModal('${catKey}')">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Agregar
                        </button>
                    </div>
                </div>
            </div>`;
        }
    }).join('');

    updateBuilderSummary();
}

/** Elimina un componente de una ranura y actualiza la UI */
function removeSlotComponent(categoryKey) {
    const catInfo = CATEGORIES[categoryKey];
    pcBuilder.removeComponent(categoryKey);
    renderBuilderSlots();
    updateBuilderSummary();
    showToast(`${catInfo.shortName} eliminado del ensamble.`, 'info');
}

/** Actualiza el panel de resumen lateral (precios, compatibilidad, wattaje) */
function updateBuilderSummary() {
    const total = pcBuilder.calculateTotalPrice();
    const count = pcBuilder.getSelectedCount();
    const wattage = pcBuilder.calculateEstimatedWattage();
    const compat = pcBuilder.checkCompatibility();

    // Encabezado del resumen
    document.getElementById('summary-badge-count').textContent = `${count} / 8`;
    document.getElementById('summary-total-price').textContent = pcBuilder.formatCurrency(total);

    // Header flotante en el nav
    document.getElementById('header-part-count').textContent = `${count}/8`;
    document.getElementById('header-total-price').textContent = pcBuilder.formatCurrency(total);

    // Barra de progreso
    const pct = Math.round((count / 8) * 100);
    document.getElementById('builder-progress-fill').style.width = pct + '%';
    document.getElementById('builder-count-label').textContent = `${count} de 8 componentes`;

    // Medidor de Watts
    const maxW = 1200;
    const wattPct = Math.min(100, Math.round((wattage / maxW) * 100));
    document.getElementById('summary-wattage-text').textContent = `~${wattage} Watts`;
    document.getElementById('summary-wattage-bar').style.width = wattPct + '%';

    // Desglose de precios por componente
    const priceList = document.getElementById('summary-price-list');
    const selectedItems = Object.entries(pcBuilder.currentBuild).filter(([, v]) => v !== null);

    if (selectedItems.length === 0) {
        priceList.innerHTML = `<li class="price-item" style="color: var(--text-muted); justify-content: center; font-style: italic;">Sin componentes todavía</li>`;
    } else {
        priceList.innerHTML = selectedItems.map(([catKey, comp]) => {
            return `<li class="price-item">
                <span title="${comp.name}">${CATEGORIES[catKey].shortName}: ${comp.brand}</span>
                <span>${pcBuilder.formatCurrency(comp.price)}</span>
            </li>`;
        }).join('');
    }

    // Panel de compatibilidad
    const compBox = document.getElementById('builder-comp-box');
    const compText = document.getElementById('comp-status-text');
    const compIcon = document.getElementById('comp-icon');
    const issuesList = document.getElementById('comp-issues-list');

    compBox.className = `compatibility-box ${compat.statusClass}`;
    compText.textContent = compat.statusLabel;

    const ICON_OK = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    const ICON_WARN = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;
    const ICON_ERR = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;

    compIcon.innerHTML = compat.hasErrors ? ICON_ERR : (compat.hasWarnings ? ICON_WARN : ICON_OK);

    if (compat.issues.length > 0) {
        issuesList.style.display = 'flex';
        issuesList.innerHTML = compat.issues.map(issue => {
            const emoji = issue.type === 'error' ? '❌' : '⚠️';
            return `<li><strong>${emoji} ${issue.title}:</strong> ${issue.message}</li>`;
        }).join('');
    } else {
        issuesList.style.display = 'none';
        issuesList.innerHTML = '';
    }
}

/* ==========================================================================
   MODAL DE SELECCIÓN DE COMPONENTES
   ========================================================================== */
let _currentModalCategory = null; // Categoría abierta en el modal

function openSelectModal(categoryKey) {
    _currentModalCategory = categoryKey;
    const catInfo = CATEGORIES[categoryKey];

    // Actualizar título e icono del modal
    document.getElementById('modal-select-title').querySelector('span').textContent = catInfo.name;
    document.getElementById('modal-select-icon').src = catInfo.icon;
    document.getElementById('modal-search-input').value = '';
    document.getElementById('modal-compat-only').checked = true;

    // Poblar filtro de marcas
    const brands = [...new Set(
        COMPONENTS_DATABASE.filter(c => c.category === categoryKey).map(c => c.brand)
    )].sort();
    const brandFilter = document.getElementById('modal-brand-filter');
    brandFilter.innerHTML = `<option value="all">Todas las Marcas</option>` +
        brands.map(b => `<option value="${b}">${b}</option>`).join('');

    renderModalList();
    openModal('modal-select-component');
}

/** Renderiza la lista de componentes dentro del modal de selección */
function renderModalList() {
    if (!_currentModalCategory) return;

    const searchVal = document.getElementById('modal-search-input').value.toLowerCase().trim();
    const brandVal = document.getElementById('modal-brand-filter').value;
    const sortVal = document.getElementById('modal-sort-select').value;
    const compatOnly = document.getElementById('modal-compat-only').checked;

    let list = COMPONENTS_DATABASE.filter(c => c.category === _currentModalCategory);

    // Filtrar por búsqueda
    if (searchVal) {
        list = list.filter(c =>
            c.name.toLowerCase().includes(searchVal) ||
            c.brand.toLowerCase().includes(searchVal) ||
            c.specs.toLowerCase().includes(searchVal)
        );
    }

    // Filtrar por marca
    if (brandVal !== 'all') {
        list = list.filter(c => c.brand === brandVal);
    }

    // Ordenar
    if (sortVal === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortVal === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortVal === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name));

    // Componente actualmente seleccionado en esta categoría
    const currentSelected = pcBuilder.currentBuild[_currentModalCategory];

    const container = document.getElementById('modal-components-list');

    if (list.length === 0) {
        container.innerHTML = `
            <div class="empty-state-box" style="border:none; padding: 40px;">
                <div class="empty-state-icon">🔍</div>
                <h3>Sin resultados</h3>
                <p>Prueba con otros términos o desactiva el filtro de compatibilidad.</p>
            </div>`;
        return;
    }

    container.innerHTML = list.map(comp => {
        const isCompatible = pcBuilder.isComponentCompatible(comp);
        const isSelected = currentSelected && currentSelected.id === comp.id;

        if (compatOnly && !isCompatible) return ''; // Ocultar incompatibles si el toggle está activo

        const incompatBadge = !isCompatible ? `
            <div class="modal-comp-incompatible-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                Posible incompatibilidad con tu selección actual
            </div>` : '';

        const actionBtn = isSelected
            ? `<button class="btn btn-secondary btn-sm" disabled style="opacity:0.6; cursor:default;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Seleccionado
               </button>`
            : `<button class="btn btn-primary btn-sm" onclick="selectComponentFromModal('${comp.id}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Elegir
               </button>`;

        const borderStyle = isSelected
            ? 'border-color: var(--accent-blue); background: rgba(37, 99, 235, 0.08);'
            : (!isCompatible ? 'opacity: 0.65; border-color: rgba(239,68,68,0.25);' : '');

        return `
        <div class="modal-component-row" style="${borderStyle}">
            <div class="modal-comp-left">
                <div class="modal-comp-thumb">
                    <img src="${comp.image}" alt="${comp.name}" width="40" height="40">
                </div>
                <div class="modal-comp-info">
                    <h4>${comp.name}</h4>
                    <div class="modal-comp-specs">${comp.specs}</div>
                    ${incompatBadge}
                </div>
            </div>
            <div class="modal-comp-right">
                <span class="modal-comp-price">${pcBuilder.formatCurrency(comp.price)}</span>
                ${actionBtn}
            </div>
        </div>`;
    }).join('');

    // Si el filtro de compatibilidad eliminó todo, mostrar mensaje amigable
    if (container.innerHTML.trim() === '' && compatOnly) {
        container.innerHTML = `
            <div class="empty-state-box" style="border:none; padding: 40px;">
                <div class="empty-state-icon">⚠️</div>
                <h3>Todos los componentes muestran incompatibilidad</h3>
                <p>Desactiva el filtro de compatibilidad para ver todos los disponibles.</p>
                <button class="btn btn-secondary btn-sm" onclick="document.getElementById('modal-compat-only').checked=false; renderModalList();">
                    Mostrar todos
                </button>
            </div>`;
    }
}

/** Ejecuta la selección de un componente desde el modal */
function selectComponentFromModal(componentId) {
    const success = pcBuilder.selectComponent(componentId);
    if (success) {
        const comp = COMPONENTS_DATABASE.find(c => c.id === componentId);
        closeModal('modal-select-component');
        renderBuilderSlots();
        updateBuilderSummary();

        // Verificar si hay nuevas incompatibilidades tras la selección
        const compat = pcBuilder.checkCompatibility();
        if (compat.hasErrors) {
            showToast(`${comp.name} agregado. ⚠️ Revisa las incompatibilidades detectadas.`, 'warning');
        } else {
            showToast(`${comp.name} agregado al ensamble.`, 'success');
        }
    }
}

/* ==========================================================================
   3. SECCIÓN CATÁLOGO DE COMPONENTES
   ========================================================================== */
let _catalogFilterCat = 'all';
let _catalogSearchTerm = '';
let _catalogBrand = 'all';
let _catalogSort = 'featured';

function initCatalogFilters() {
    // Poblar selector de marcas con todas las marcas únicas
    const allBrands = [...new Set(COMPONENTS_DATABASE.map(c => c.brand))].sort();
    const brandSel = document.getElementById('catalog-brand-filter');
    brandSel.innerHTML = `<option value="all">Todas las Marcas</option>` +
        allBrands.map(b => `<option value="${b}">${b}</option>`).join('');

    // Escuchar cambios en los filtros
    document.getElementById('catalog-search-input').addEventListener('input', (e) => {
        _catalogSearchTerm = e.target.value.toLowerCase().trim();
        renderCatalogGrid();
    });

    brandSel.addEventListener('change', (e) => {
        _catalogBrand = e.target.value;
        renderCatalogGrid();
    });

    document.getElementById('catalog-sort-select').addEventListener('change', (e) => {
        _catalogSort = e.target.value;
        renderCatalogGrid();
    });

    // Pestañas de categorías
    document.querySelectorAll('#catalog-category-tabs .category-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#catalog-category-tabs .category-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            _catalogFilterCat = btn.dataset.cat;
            renderCatalogGrid();
        });
    });
}

function renderCatalogGrid() {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    let list = [...COMPONENTS_DATABASE];

    // Filtrar por categoría
    if (_catalogFilterCat !== 'all') {
        list = list.filter(c => c.category === _catalogFilterCat);
    }

    // Filtrar por búsqueda
    if (_catalogSearchTerm) {
        list = list.filter(c =>
            c.name.toLowerCase().includes(_catalogSearchTerm) ||
            c.brand.toLowerCase().includes(_catalogSearchTerm) ||
            c.specs.toLowerCase().includes(_catalogSearchTerm) ||
            (c.description && c.description.toLowerCase().includes(_catalogSearchTerm))
        );
    }

    // Filtrar por marca
    if (_catalogBrand !== 'all') {
        list = list.filter(c => c.brand === _catalogBrand);
    }

    // Ordenar
    if (_catalogSort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (_catalogSort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (_catalogSort === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name));

    if (list.length === 0) {
        grid.innerHTML = `
            <div class="empty-state-box" style="grid-column: 1/-1;">
                <div class="empty-state-icon">🔍</div>
                <h3>No se encontraron componentes</h3>
                <p>Prueba con otros filtros o términos de búsqueda.</p>
            </div>`;
        return;
    }

    grid.innerHTML = list.map(comp => {
        const catInfo = CATEGORIES[comp.category];
        const isSelected = pcBuilder.currentBuild[comp.category] &&
            pcBuilder.currentBuild[comp.category].id === comp.id;

        const actionBtn = isSelected
            ? `<button class="btn btn-secondary btn-sm" disabled style="opacity:0.7;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    En tu PC
               </button>`
            : `<button class="btn btn-primary btn-sm" onclick="addFromCatalog('${comp.id}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Agregar
               </button>`;

        return `
        <div class="catalog-card" id="catalog-card-${comp.id}">
            <div>
                <div class="catalog-card-top">
                    <span class="badge badge-blue">${catInfo.shortName}</span>
                    <span style="font-size: 0.82rem; color: var(--text-muted);">${comp.brand}</span>
                </div>
                <div class="catalog-card-image">
                    <img src="${comp.image}" alt="${comp.name}" loading="lazy">
                </div>
                <h3 class="catalog-card-title">${comp.name}</h3>
                <p class="catalog-card-specs">${comp.specs}</p>
            </div>
            <div class="catalog-card-bottom">
                <span class="catalog-card-price">${pcBuilder.formatCurrency(comp.price)}</span>
                ${actionBtn}
            </div>
        </div>`;
    }).join('');
}

/** Agrega un componente desde el catálogo directamente al constructor */
function addFromCatalog(componentId) {
    const comp = COMPONENTS_DATABASE.find(c => c.id === componentId);
    if (!comp) return;

    pcBuilder.selectComponent(componentId);

    // Verificar compatibilidad post-selección
    const compat = pcBuilder.checkCompatibility();
    if (compat.hasErrors) {
        showToast(`${comp.name} agregado. ⚠️ Incompatibilidad detectada.`, 'warning');
    } else {
        showToast(`${comp.name} agregado a tu ensamble.`, 'success');
    }

    // Re-renderizar para actualizar el botón "En tu PC"
    renderCatalogGrid();
    updateBuilderSummary();
}

/* ==========================================================================
   4. SECCIÓN MIS CONFIGURACIONES (LOCALSTORAGE)
   ========================================================================== */
function renderSavedBuildsGrid() {
    const grid = document.getElementById('saved-builds-grid');
    if (!grid) return;

    const builds = pcBuilder.getSavedBuilds();

    if (builds.length === 0) {
        grid.innerHTML = `
            <div class="empty-state-box" style="grid-column: 1/-1;">
                <div class="empty-state-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                </div>
                <h3>Sin configuraciones guardadas</h3>
                <p>Arma tu primer PC en el constructor y guárdala con el botón <strong>"Guardar Configuración"</strong>.</p>
                <button class="btn btn-primary" onclick="navigateTo('builder')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Ir al Constructor
                </button>
            </div>`;
        return;
    }

    grid.innerHTML = builds.map(build => {
        // Construir preview de componentes con sus nombres
        const previewRows = Object.entries(build.componentIds)
            .filter(([, id]) => id !== null)
            .slice(0, 4)
            .map(([catKey, compId]) => {
                const comp = COMPONENTS_DATABASE.find(c => c.id === compId);
                const cat = CATEGORIES[catKey];
                return `<div class="preview-row">
                    <span class="preview-cat">${cat ? cat.shortName : catKey}</span>
                    <span>${comp ? comp.name.split(' ').slice(0, 3).join(' ') : 'N/A'}</span>
                </div>`;
            }).join('');

        const totalComps = Object.values(build.componentIds).filter(Boolean).length;

        return `
        <div class="saved-build-card">
            <div>
                <div class="saved-card-header">
                    <div>
                        <h3 class="saved-card-title">${escapeHtml(build.name)}</h3>
                        <div class="saved-card-date">${build.date} · ${build.time}</div>
                    </div>
                    <span class="badge badge-blue">${totalComps}/8 partes</span>
                </div>
                <div class="saved-components-preview">${previewRows}</div>
            </div>
            <div class="saved-card-footer">
                <span class="saved-total-price">${pcBuilder.formatCurrency(build.totalPrice)}</span>
                <div style="display:flex; gap:8px;">
                    <button class="btn btn-primary btn-sm" onclick="loadSavedBuildToBuilder('${build.id}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        Cargar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSavedBuildPrompt('${build.id}', '${escapeHtml(build.name)}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
}

/** Carga una configuración guardada al builder y navega */
function loadSavedBuildToBuilder(buildId) {
    const ok = pcBuilder.loadSavedBuild(buildId);
    if (ok) {
        navigateTo('builder');
        renderBuilderSlots();
        updateBuilderSummary();
        showToast('Configuración cargada en el constructor.', 'success');
    }
}

/** Muestra confirmación antes de eliminar una configuración guardada */
function deleteSavedBuildPrompt(buildId, buildName) {
    showConfirm(
        'Eliminar Configuración',
        `¿Seguro que deseas eliminar "${buildName}"? Esta acción no se puede deshacer.`,
        () => {
            pcBuilder.deleteSavedBuild(buildId);
            renderSavedBuildsGrid();
            showToast('Configuración eliminada.', 'info');
        },
        'Eliminar'
    );
}

/* ==========================================================================
   GUARDAR CONFIGURACIÓN ACTUAL
   ========================================================================== */
function initSaveBuildModal() {
    // Botón de guardar en la barra lateral
    document.getElementById('btn-save-build').addEventListener('click', () => {
        if (pcBuilder.getSelectedCount() === 0) {
            showToast('Agrega al menos un componente antes de guardar.', 'warning');
            return;
        }
        document.getElementById('save-build-name-input').value = '';
        openModal('modal-save-build');
        setTimeout(() => document.getElementById('save-build-name-input').focus(), 200);
    });

    document.getElementById('modal-save-close').addEventListener('click', () => closeModal('modal-save-build'));
    document.getElementById('modal-save-cancel').addEventListener('click', () => closeModal('modal-save-build'));

    document.getElementById('modal-save-confirm').addEventListener('click', () => {
        const name = document.getElementById('save-build-name-input').value.trim();
        const saved = pcBuilder.saveCurrentBuild(name || 'Mi Ensamble');
        closeModal('modal-save-build');
        showToast(`"${saved.name}" guardado correctamente.`, 'success');
    });

    // Guardar con Enter
    document.getElementById('save-build-name-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('modal-save-confirm').click();
    });
}

/* ==========================================================================
   EXPORTAR / COMPARTIR CONFIGURACIÓN
   ========================================================================== */
function initExportModal() {
    document.getElementById('btn-export-build').addEventListener('click', () => {
        if (pcBuilder.getSelectedCount() === 0) {
            showToast('Agrega componentes para poder exportar.', 'warning');
            return;
        }
        const text = pcBuilder.exportBuildText();
        document.getElementById('export-textarea').value = text;
        openModal('modal-export-build');
    });

    document.getElementById('modal-export-close').addEventListener('click', () => closeModal('modal-export-build'));

    document.getElementById('btn-copy-clipboard').addEventListener('click', () => {
        const textarea = document.getElementById('export-textarea');
        navigator.clipboard.writeText(textarea.value).then(() => {
            showToast('Texto copiado al portapapeles.', 'success');
        }).catch(() => {
            textarea.select();
            document.execCommand('copy');
            showToast('Texto copiado.', 'success');
        });
    });

    document.getElementById('btn-download-txt').addEventListener('click', () => {
        const text = document.getElementById('export-textarea').value;
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pc-builder-ensamble.txt';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Archivo descargado.', 'success');
    });
}

/* ==========================================================================
   BOTÓN REINICIAR CONFIGURACIÓN
   ========================================================================== */
function initClearBuildBtn() {
    document.getElementById('btn-clear-build').addEventListener('click', () => {
        if (pcBuilder.getSelectedCount() === 0) {
            showToast('El ensamble ya está vacío.', 'info');
            return;
        }
        showConfirm(
            'Reiniciar Configuración',
            '¿Seguro que deseas eliminar todos los componentes seleccionados? El borrador guardado también se borrará.',
            () => {
                pcBuilder.clearBuild();
                renderBuilderSlots();
                updateBuilderSummary();
                showToast('Configuración reiniciada.', 'info');
            },
            'Reiniciar'
        );
    });
}

/* ==========================================================================
   MODAL CONFIRMACIÓN – EVENTOS
   ========================================================================== */
function initConfirmModal() {
    document.getElementById('modal-confirm-close').addEventListener('click', () => closeModal('modal-confirm-action'));
    document.getElementById('modal-confirm-cancel').addEventListener('click', () => closeModal('modal-confirm-action'));
    document.getElementById('modal-confirm-btn').addEventListener('click', () => {
        closeModal('modal-confirm-action');
        if (typeof _confirmCallback === 'function') {
            _confirmCallback();
            _confirmCallback = null;
        }
    });
}

/* ==========================================================================
   MODAL DE SELECCIÓN – EVENTOS DE FILTROS
   ========================================================================== */
function initSelectModalFilters() {
    document.getElementById('modal-select-close').addEventListener('click', () => closeModal('modal-select-component'));

    document.getElementById('modal-search-input').addEventListener('input', renderModalList);
    document.getElementById('modal-brand-filter').addEventListener('change', renderModalList);
    document.getElementById('modal-sort-select').addEventListener('change', renderModalList);
    document.getElementById('modal-compat-only').addEventListener('change', renderModalList);
}

/* ==========================================================================
   NAVEGACIÓN – ENLACES DEL HEADER, FOOTER Y PILLS
   ========================================================================== */
function initNavEvents() {
    // Nav links principales
    document.querySelectorAll('.nav-link[data-view]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.view);
        });
    });

    // Todos los href="#section" que actúen como navegación SPA
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href').replace('#', '');
            const validViews = ['home', 'builder', 'components', 'saved', 'about'];
            if (validViews.includes(href)) {
                e.preventDefault();
                navigateTo(href);
            }
        });
    });

    // Footer links con data-filter-cat para ir al catálogo con filtro
    document.querySelectorAll('[data-filter-cat]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const cat = link.dataset.filterCat;
            _catalogFilterCat = cat;
            document.querySelectorAll('#catalog-category-tabs .category-tab-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.cat === cat);
            });
            navigateTo('components');
        });
    });

    // Botón summary pill en el header → va al builder
    document.getElementById('header-summary-btn').addEventListener('click', () => {
        navigateTo('builder');
    });

    // Botón hamburguesa móvil
    document.getElementById('mobile-toggle-btn').addEventListener('click', () => {
        document.getElementById('main-nav').classList.toggle('mobile-open');
    });
}

/* ==========================================================================
   FAQ – ACORDEÓN
   ========================================================================== */
function initFaqAccordion() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');
            // Cerrar todos primero
            document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
            // Abrir el clickeado si estaba cerrado
            if (!isOpen) item.classList.add('open');
        });
    });
}

/* ==========================================================================
   UTILIDADES
   ========================================================================== */
/** Escapa HTML para prevenir XSS en nombres de ensambles guardados */
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/* ==========================================================================
   PUNTO DE ENTRADA – INICIALIZACIÓN COMPLETA
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Configurar navegación SPA y enrutamiento
    initNavEvents();
    initRouter();

    // 2. Inicializar funcionalidades del constructor
    initClearBuildBtn();
    initSaveBuildModal();
    initExportModal();

    // 3. Inicializar filtros del catálogo
    initCatalogFilters();

    // 4. Inicializar modales
    initSelectModalFilters();
    initConfirmModal();

    // Cerrar modales haciendo clic en el overlay
    ['modal-select-component', 'modal-save-build', 'modal-export-build', 'modal-confirm-action'].forEach(initModalOverlayClose);

    // 5. Inicializar acordeón FAQ
    initFaqAccordion();

    // 6. Renderizar resumen del builder en el header desde el estado guardado
    updateBuilderSummary();

    console.log('%cPC BUILDER iniciado correctamente ✔', 'color: #00f0ff; font-weight: bold; font-size: 14px;');
});

