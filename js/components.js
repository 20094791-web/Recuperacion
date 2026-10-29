/**
 * PC BUILDER - Base de Datos Local de Componentes y Presets
 * Contiene especificaciones técnicas reales, factores de forma, sockets,
 * tipos de memoria y precios en USD para la simulación de compatibilidad.
 */

const CATEGORIES = {
    cpu: {
        id: 'cpu',
        name: 'Procesador (CPU)',
        shortName: 'CPU',
        icon: 'assets/images/cpu.svg',
        description: 'El cerebro de la computadora. Define la velocidad de procesamiento.',
        required: true
    },
    motherboard: {
        id: 'motherboard',
        name: 'Placa Madre',
        shortName: 'Placa Madre',
        icon: 'assets/images/motherboard.svg',
        description: 'Conecta e intercomunica todos los componentes del sistema.',
        required: true
    },
    gpu: {
        id: 'gpu',
        name: 'Tarjeta Gráfica (GPU)',
        shortName: 'GPU',
        icon: 'assets/images/gpu.svg',
        description: 'Procesa gráficos para videojuegos, renderizado 3D y video.',
        required: true
    },
    ram: {
        id: 'ram',
        name: 'Memoria RAM',
        shortName: 'RAM',
        icon: 'assets/images/ram.svg',
        description: 'Memoria ultrarrápida para ejecución fluida de tareas y juegos.',
        required: true
    },
    storage: {
        id: 'storage',
        name: 'Almacenamiento (SSD / HDD)',
        shortName: 'Almacenamiento',
        icon: 'assets/images/storage.svg',
        description: 'Disco de estado sólido de alta velocidad para sistema y juegos.',
        required: true
    },
    cooler: {
        id: 'cooler',
        name: 'Refrigeración (Cooler / AIO)',
        shortName: 'Refrigeración',
        icon: 'assets/images/cooler.svg',
        description: 'Mantiene las temperaturas del procesador en rangos óptimos.',
        required: true
    },
    psu: {
        id: 'psu',
        name: 'Fuente de Poder (PSU)',
        shortName: 'Fuente',
        icon: 'assets/images/psu.svg',
        description: 'Suministra energía eléctrica estable a todo el ensamble.',
        required: true
    },
    case: {
        id: 'case',
        name: 'Gabinete (Case)',
        shortName: 'Gabinete',
        icon: 'assets/images/case.svg',
        description: 'Chasis donde se ensamblan y protegen todos los componentes.',
        required: true
    }
};

const COMPONENTS_DATABASE = [
    // ==========================================
    // PROCESADORES (CPU)
    // ==========================================
    {
        id: 'cpu-r7-7800x3d',
        category: 'cpu',
        name: 'AMD Ryzen 7 7800X3D',
        brand: 'AMD',
        price: 389.99,
        image: 'assets/images/cpu.svg',
        specs: '8 Núcleos / 16 Hilos • Hasta 5.0 GHz • 96MB 3D V-Cache',
        socket: 'AM5',
        supportedRam: ['DDR5'],
        tdp: 120,
        integratedGpu: true,
        description: 'El procesador gaming #1 del mundo. Su tecnología 3D V-Cache ofrece los máximos FPS en juegos competitivos.'
    },
    {
        id: 'cpu-r5-7600x',
        category: 'cpu',
        name: 'AMD Ryzen 5 7600X',
        brand: 'AMD',
        price: 209.99,
        image: 'assets/images/cpu.svg',
        specs: '6 Núcleos / 12 Hilos • Hasta 5.3 GHz • 38MB Caché',
        socket: 'AM5',
        supportedRam: ['DDR5'],
        tdp: 105,
        integratedGpu: true,
        description: 'Excelente rendimiento calidad/precio en la plataforma moderna AM5 con soporte para memorias DDR5.'
    },
    {
        id: 'cpu-r9-7950x',
        category: 'cpu',
        name: 'AMD Ryzen 9 7950X',
        brand: 'AMD',
        price: 549.99,
        image: 'assets/images/cpu.svg',
        specs: '16 Núcleos / 32 Hilos • Hasta 5.7 GHz • 80MB Caché',
        socket: 'AM5',
        supportedRam: ['DDR5'],
        tdp: 170,
        integratedGpu: true,
        description: 'Poder bestial para estaciones de trabajo, streaming pesado, edición 8K y renderizado arquitectónico.'
    },
    {
        id: 'cpu-i7-14700k',
        category: 'cpu',
        name: 'Intel Core i7-14700K',
        brand: 'Intel',
        price: 399.99,
        image: 'assets/images/cpu.svg',
        specs: '20 Núcleos (8P+12E) / 28 Hilos • Hasta 5.6 GHz • 33MB Smart Cache',
        socket: 'LGA1700',
        supportedRam: ['DDR4', 'DDR5'],
        tdp: 125,
        integratedGpu: true,
        description: 'Arquitectura híbrida de 14ª Generación, perfecto para multitarea extrema y gaming de alta gama.'
    },
    {
        id: 'cpu-i5-13600k',
        category: 'cpu',
        name: 'Intel Core i5-13600K',
        brand: 'Intel',
        price: 269.99,
        image: 'assets/images/cpu.svg',
        specs: '14 Núcleos (6P+8E) / 20 Hilos • Hasta 5.1 GHz • 24MB Smart Cache',
        socket: 'LGA1700',
        supportedRam: ['DDR4', 'DDR5'],
        tdp: 125,
        integratedGpu: true,
        description: 'Uno de los procesadores más balanceados y populares de Intel para cualquier tarjeta gráfica moderna.'
    },
    {
        id: 'cpu-i9-14900k',
        category: 'cpu',
        name: 'Intel Core i9-14900K',
        brand: 'Intel',
        price: 569.99,
        image: 'assets/images/cpu.svg',
        specs: '24 Núcleos (8P+16E) / 32 Hilos • Hasta 6.0 GHz Thermal Velocity Boost',
        socket: 'LGA1700',
        supportedRam: ['DDR4', 'DDR5'],
        tdp: 253,
        integratedGpu: true,
        description: 'La cima del poder mono-hilo y multi-hilo alcanzando la barrera mítica de los 6.0 GHz.'
    },
    {
        id: 'cpu-i5-12400f',
        category: 'cpu',
        name: 'Intel Core i5-12400F',
        brand: 'Intel',
        price: 129.99,
        image: 'assets/images/cpu.svg',
        specs: '6 Núcleos / 12 Hilos • Hasta 4.4 GHz • 18MB Caché (Requiere GPU)',
        socket: 'LGA1700',
        supportedRam: ['DDR4', 'DDR5'],
        tdp: 65,
        integratedGpu: false,
        description: 'El rey de la gama de entrada. Costo ultra competitivo y consumo energético muy reducido.'
    },
    {
        id: 'cpu-r7-5800x3d',
        category: 'cpu',
        name: 'AMD Ryzen 7 5800X3D',
        brand: 'AMD',
        price: 289.99,
        image: 'assets/images/cpu.svg',
        specs: '8 Núcleos / 16 Hilos • Hasta 4.5 GHz • 96MB 3D V-Cache',
        socket: 'AM4',
        supportedRam: ['DDR4'],
        tdp: 105,
        integratedGpu: false,
        description: 'La máxima actualización posible para la legendaria plataforma AM4 con memorias DDR4.'
    },
    {
        id: 'cpu-r5-5600x',
        category: 'cpu',
        name: 'AMD Ryzen 5 5600X',
        brand: 'AMD',
        price: 139.99,
        image: 'assets/images/cpu.svg',
        specs: '6 Núcleos / 12 Hilos • Hasta 4.6 GHz • 35MB GameCache',
        socket: 'AM4',
        supportedRam: ['DDR4'],
        tdp: 65,
        integratedGpu: false,
        description: 'Opción económica legendaria para ensambles gamer accesibles de 1080p y 1440p.'
    },

    // ==========================================
    // PLACAS MADRE (MOTHERBOARD)
    // ==========================================
    {
        id: 'mb-b650-strix',
        category: 'motherboard',
        name: 'ASUS ROG STRIX B650-A Gaming WiFi',
        brand: 'ASUS',
        price: 229.99,
        image: 'assets/images/motherboard.svg',
        specs: 'Socket AM5 • ATX • DDR5 (4 Slots) • PCIe 5.0 M.2 • WiFi 6E',
        socket: 'AM5',
        ramType: 'DDR5',
        formFactor: 'ATX',
        maxRamSlots: 4,
        description: 'Placa madre premium AM5 con disipación VRM robusta, estética blanca plateada y conectividad WiFi 6E.'
    },
    {
        id: 'mb-x670e-tomahawk',
        category: 'motherboard',
        name: 'MSI MAG X670E TOMAHAWK WIFI',
        brand: 'MSI',
        price: 279.99,
        image: 'assets/images/motherboard.svg',
        specs: 'Socket AM5 • ATX • DDR5 (4 Slots) • PCIe 5.0 x16 + M.2 • LAN 2.5G',
        socket: 'AM5',
        ramType: 'DDR5',
        formFactor: 'ATX',
        maxRamSlots: 4,
        description: 'Chipset tope de gama X670E con soporte completo PCIe 5.0 para tarjetas gráficas y discos de nueva generación.'
    },
    {
        id: 'mb-b650m-aorus',
        category: 'motherboard',
        name: 'GIGABYTE B650M AORUS ELITE AX',
        brand: 'GIGABYTE',
        price: 179.99,
        image: 'assets/images/motherboard.svg',
        specs: 'Socket AM5 • Micro-ATX • DDR5 (4 Slots) • PCIe 5.0 M.2 • WiFi 6E',
        socket: 'AM5',
        ramType: 'DDR5',
        formFactor: 'Micro-ATX',
        maxRamSlots: 4,
        description: 'Formato compacto Micro-ATX sin comprometer potencia ni slots para memorias DDR5.'
    },
    {
        id: 'mb-z790-msi',
        category: 'motherboard',
        name: 'MSI PRO Z790-P WIFI',
        brand: 'MSI',
        price: 209.99,
        image: 'assets/images/motherboard.svg',
        specs: 'Socket LGA1700 • ATX • DDR5 (4 Slots) • PCIe 5.0 • WiFi 6E',
        socket: 'LGA1700',
        ramType: 'DDR5',
        formFactor: 'ATX',
        maxRamSlots: 4,
        description: 'Placa con chipset Intel Z790 lista para overclocking estable en CPUs de 13ª y 14ª generación.'
    },
    {
        id: 'mb-b760-asus-d4',
        category: 'motherboard',
        name: 'ASUS PRIME B760-PLUS D4',
        brand: 'ASUS',
        price: 149.99,
        image: 'assets/images/motherboard.svg',
        specs: 'Socket LGA1700 • ATX • DDR4 (4 Slots) • PCIe 5.0 • 3x M.2',
        socket: 'LGA1700',
        ramType: 'DDR4',
        formFactor: 'ATX',
        maxRamSlots: 4,
        description: 'Permite armar procesadores Intel modernos aprovechando memorias económicas DDR4.'
    },
    {
        id: 'mb-z790-aorus-master',
        category: 'motherboard',
        name: 'GIGABYTE Z790 AORUS MASTER X',
        brand: 'GIGABYTE',
        price: 459.99,
        image: 'assets/images/motherboard.svg',
        specs: 'Socket LGA1700 • ATX • DDR5 (4 Slots 8266MHz OC) • WiFi 7 • VRM 20+1+2',
        socket: 'LGA1700',
        ramType: 'DDR5',
        formFactor: 'ATX',
        maxRamSlots: 4,
        description: 'Placa madre entusiasta grado ultra con disipadores masivos, WiFi 7 y soporte de audio audiófilo.'
    },
    {
        id: 'mb-b550-tomahawk',
        category: 'motherboard',
        name: 'MSI MAG B550 TOMAHAWK MAX WIFI',
        brand: 'MSI',
        price: 159.99,
        image: 'assets/images/motherboard.svg',
        specs: 'Socket AM4 • ATX • DDR4 (4 Slots) • PCIe 4.0 • LAN Dual',
        socket: 'AM4',
        ramType: 'DDR4',
        formFactor: 'ATX',
        maxRamSlots: 4,
        description: 'La opción más respetada para procesadores AMD Ryzen serie 5000 y memorias DDR4.'
    },
    {
        id: 'mb-b550m-tuf',
        category: 'motherboard',
        name: 'ASUS TUF GAMING B550M-PLUS',
        brand: 'ASUS',
        price: 129.99,
        image: 'assets/images/motherboard.svg',
        specs: 'Socket AM4 • Micro-ATX • DDR4 (4 Slots) • PCIe 4.0 • Componentes TUF Grado Militar',
        socket: 'AM4',
        ramType: 'DDR4',
        formFactor: 'Micro-ATX',
        maxRamSlots: 4,
        description: 'Placa madre confiable Micro-ATX AM4 con componentes de máxima durabilidad.'
    },

    // ==========================================
    // TARJETAS GRÁFICAS (GPU)
    // ==========================================
    {
        id: 'gpu-rtx-4090',
        category: 'gpu',
        name: 'NVIDIA GeForce RTX 4090 24GB',
        brand: 'NVIDIA',
        price: 1799.99,
        image: 'assets/images/gpu.svg',
        specs: '24GB GDDR6X • DLSS 3.5 Frame Gen • Ray Tracing 3ª Gen • TDP 450W',
        tdp: 450,
        recommendedPsu: 850,
        length: 304,
        description: 'El buque insignia absoluto. Capaz de mover cualquier título en resolución nativa 4K con Ray Tracing al máximo.'
    },
    {
        id: 'gpu-rtx-4080s',
        category: 'gpu',
        name: 'NVIDIA GeForce RTX 4080 Super 16GB',
        brand: 'NVIDIA',
        price: 999.99,
        image: 'assets/images/gpu.svg',
        specs: '16GB GDDR6X • DLSS 3.5 • Ray Tracing • TDP 320W',
        tdp: 320,
        recommendedPsu: 750,
        length: 310,
        description: 'Rendimiento bestial en 4K y 1440p alta tasa de refresco, con 16GB de VRAM para juegos y creación.'
    },
    {
        id: 'gpu-rtx-4070ti-s',
        category: 'gpu',
        name: 'NVIDIA GeForce RTX 4070 Ti Super 16GB',
        brand: 'NVIDIA',
        price: 799.99,
        image: 'assets/images/gpu.svg',
        specs: '16GB GDDR6X • Bus 256-bit • DLSS 3 • TDP 285W',
        tdp: 285,
        recommendedPsu: 700,
        length: 295,
        description: '16GB de VRAM de alta velocidad para longevidad garantizada en títulos AAA modernos.'
    },
    {
        id: 'gpu-rtx-4070-s',
        category: 'gpu',
        name: 'NVIDIA GeForce RTX 4070 Super 12GB',
        brand: 'NVIDIA',
        price: 599.99,
        image: 'assets/images/gpu.svg',
        specs: '12GB GDDR6X • DLSS 3 • TDP 220W • Eficiencia líder',
        tdp: 220,
        recommendedPsu: 650,
        length: 242,
        description: 'La tarjeta más recomendada para gaming fluido a 1440p (2K) con calidad Ultra.'
    },
    {
        id: 'gpu-rtx-4060',
        category: 'gpu',
        name: 'NVIDIA GeForce RTX 4060 8GB',
        brand: 'NVIDIA',
        price: 299.99,
        image: 'assets/images/gpu.svg',
        specs: '8GB GDDR6 • DLSS 3 Frame Gen • TDP 115W ultrabajo',
        tdp: 115,
        recommendedPsu: 500,
        length: 220,
        description: 'Ideal para 1080p competitivo con tecnologías modernas y consumo energético mínimo.'
    },
    {
        id: 'gpu-rx-7900xtx',
        category: 'gpu',
        name: 'AMD Radeon RX 7900 XTX 24GB',
        brand: 'AMD',
        price: 929.99,
        image: 'assets/images/gpu.svg',
        specs: '24GB GDDR6 • Bus 384-bit • FSR 3 • TDP 355W',
        tdp: 355,
        recommendedPsu: 800,
        length: 287,
        description: 'La GPU más potente de AMD. 24GB de memoria pura para gaming en 4K sin restricciones.'
    },
    {
        id: 'gpu-rx-7800xt',
        category: 'gpu',
        name: 'AMD Radeon RX 7800 XT 16GB',
        brand: 'AMD',
        price: 499.99,
        image: 'assets/images/gpu.svg',
        specs: '16GB GDDR6 • Arquitectura RDNA 3 • TDP 263W',
        tdp: 263,
        recommendedPsu: 700,
        length: 267,
        description: 'Excelente relación precio por FPS en 1440p con 16GB de memoria de video.'
    },
    {
        id: 'gpu-rx-7600xt',
        category: 'gpu',
        name: 'AMD Radeon RX 7600 XT 16GB',
        brand: 'AMD',
        price: 319.99,
        image: 'assets/images/gpu.svg',
        specs: '16GB GDDR6 • DisplayPort 2.1 • TDP 190W',
        tdp: 190,
        recommendedPsu: 550,
        length: 241,
        description: '16GB de VRAM en un rango accesible para juegos demandantes en 1080p.'
    },

    // ==========================================
    // MEMORIA RAM
    // ==========================================
    {
        id: 'ram-corsair-ddr5-32',
        category: 'ram',
        name: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5',
        brand: 'Corsair',
        price: 119.99,
        image: 'assets/images/ram.svg',
        specs: 'DDR5 6000MHz CL30 • Kit Dual Channel • Iluminación RGB Ten-Zone',
        ramType: 'DDR5',
        speed: '6000 MHz',
        capacity: '32GB (2x16GB)',
        description: 'El punto dulce para procesadores modernos AM5 e Intel Core con latencia CL30 ultrarrápida.'
    },
    {
        id: 'ram-gskill-ddr5-32',
        category: 'ram',
        name: 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5',
        brand: 'G.Skill',
        price: 139.99,
        image: 'assets/images/ram.svg',
        specs: 'DDR5 6400MHz CL32 • Disipador de aluminio cepillado • Soporte Intel XMP 3.0',
        ramType: 'DDR5',
        speed: '6400 MHz',
        capacity: '32GB (2x16GB)',
        description: 'Velocidad extrema de 6400MHz con diseño ganador de premios de diseño Red Dot.'
    },
    {
        id: 'ram-kingston-ddr5-64',
        category: 'ram',
        name: 'Kingston FURY Beast 64GB (2x32GB) DDR5',
        brand: 'Kingston',
        price: 199.99,
        image: 'assets/images/ram.svg',
        specs: 'DDR5 5600MHz CL40 • 64GB Gran Capacidad • Perfil bajo',
        ramType: 'DDR5',
        speed: '5600 MHz',
        capacity: '64GB (2x32GB)',
        description: 'Capacidad masiva de 64GB para edición de video 4K/8K, máquinas virtuales y animación 3D.'
    },
    {
        id: 'ram-crucial-ddr5-32',
        category: 'ram',
        name: 'Crucial Pro 32GB (2x16GB) DDR5',
        brand: 'Crucial',
        price: 89.99,
        image: 'assets/images/ram.svg',
        specs: 'DDR5 5600MHz CL46 • Disipador Negro Mate • Plug & Play',
        ramType: 'DDR5',
        speed: '5600 MHz',
        capacity: '32GB (2x16GB)',
        description: 'Opción sobria, elegante y sin luces RGB, enfocada en 100% de confiabilidad.'
    },
    {
        id: 'ram-corsair-ddr4-32',
        category: 'ram',
        name: 'Corsair Vengeance LPX 32GB (2x16GB) DDR4',
        brand: 'Corsair',
        price: 69.99,
        image: 'assets/images/ram.svg',
        specs: 'DDR4 3600MHz CL18 • Perfil bajo • Disipador de aluminio puro',
        ramType: 'DDR4',
        speed: '3600 MHz',
        capacity: '32GB (2x16GB)',
        description: 'La memoria DDR4 más vendida y probada para plataformas AM4 y placas Intel DDR4.'
    },
    {
        id: 'ram-kingston-ddr4-16',
        category: 'ram',
        name: 'Kingston FURY Beast RGB 16GB (2x8GB) DDR4',
        brand: 'Kingston',
        price: 44.99,
        image: 'assets/images/ram.svg',
        specs: 'DDR4 3200MHz CL16 • RGB Dinámico • Sincronización Infrarroja',
        ramType: 'DDR4',
        speed: '3200 MHz',
        capacity: '16GB (2x8GB)',
        description: 'Kit de 16GB básico y muy económico para presupuestos ajustados.'
    },

    // ==========================================
    // ALMACENAMIENTO (STORAGE)
    // ==========================================
    {
        id: 'ssd-samsung-990pro-2tb',
        category: 'storage',
        name: 'Samsung 990 PRO 2TB NVMe M.2',
        brand: 'Samsung',
        price: 179.99,
        image: 'assets/images/storage.svg',
        specs: 'PCIe 4.0 NVMe • Lectura: 7450 MB/s | Escritura: 6900 MB/s • DRAM Cache 2GB',
        type: 'NVMe M.2',
        capacity: '2TB',
        description: 'La unidad SSD PCIe 4.0 de mayor velocidad y durabilidad del mercado con memoria V-NAND Samsung.'
    },
    {
        id: 'ssd-kingston-kc3000-1tb',
        category: 'storage',
        name: 'Kingston KC3000 1TB NVMe M.2',
        brand: 'Kingston',
        price: 99.99,
        image: 'assets/images/storage.svg',
        specs: 'PCIe 4.0 NVMe • Lectura: 7000 MB/s | Escritura: 6000 MB/s • Disipador de grafeno',
        type: 'NVMe M.2',
        capacity: '1TB',
        description: 'Rendimiento de nivel empresarial a precio de consumo. Tiempos de carga casi instantáneos.'
    },
    {
        id: 'ssd-crucial-t700-2tb',
        category: 'storage',
        name: 'Crucial T700 2TB PCIe 5.0 NVMe M.2',
        brand: 'Crucial',
        price: 269.99,
        image: 'assets/images/storage.svg',
        specs: 'PCIe 5.0 (Gen 5) • Lectura: 12400 MB/s | Escritura: 11800 MB/s',
        type: 'NVMe M.2 (PCIe 5.0)',
        capacity: '2TB',
        description: 'Velocidad extrema de 5ª Generación para creadores que mueven cientos de Gigabytes por segundo.'
    },
    {
        id: 'ssd-wd-sn770-1tb',
        category: 'storage',
        name: 'WD_BLACK SN770 1TB NVMe M.2',
        brand: 'Western Digital',
        price: 74.99,
        image: 'assets/images/storage.svg',
        specs: 'PCIe 4.0 NVMe • Lectura: 5150 MB/s | Escritura: 4900 MB/s',
        type: 'NVMe M.2',
        capacity: '1TB',
        description: 'Excelente opción gamer dedicada sin gastar de más, optimizada para juegos pesados.'
    },
    {
        id: 'ssd-crucial-p3-4tb',
        category: 'storage',
        name: 'Crucial P3 Plus 4TB NVMe M.2',
        brand: 'Crucial',
        price: 229.99,
        image: 'assets/images/storage.svg',
        specs: 'PCIe 4.0 NVMe • 4 Terabytes • Lectura: 5000 MB/s',
        type: 'NVMe M.2',
        capacity: '4TB',
        description: 'Espacio descomunal para almacenar bibliotecas completas de juegos de más de 100GB.'
    },

    // ==========================================
    // REFRIGERACIÓN (COOLER)
    // ==========================================
    {
        id: 'cooler-corsair-h150i',
        category: 'cooler',
        name: 'Corsair iCUE LINK H150i RGB 360mm',
        brand: 'Corsair',
        price: 239.99,
        image: 'assets/images/cooler.svg',
        specs: 'Líquida AIO 360mm • 3x Ventiladores QX120 RGB • Cable único iCUE LINK',
        supportedSockets: ['AM5', 'AM4', 'LGA1700'],
        maxTdp: 320,
        type: 'Líquida AIO',
        description: 'Refrigeración líquida tope de gama para enfriar con soltura procesadores i9 y Ryzen 9.'
    },
    {
        id: 'cooler-deepcool-lt720',
        category: 'cooler',
        name: 'DeepCool LT720 360mm AIO Líquida',
        brand: 'DeepCool',
        price: 139.99,
        image: 'assets/images/cooler.svg',
        specs: 'Líquida AIO 360mm • Bloque de espejo infinito multidimensional • Bomba 4ª Gen',
        supportedSockets: ['AM5', 'AM4', 'LGA1700'],
        maxTdp: 300,
        type: 'Líquida AIO',
        description: 'La mejor líquida en relación rendimiento-precio del mercado, con diseño visual impresionante.'
    },
    {
        id: 'cooler-thermalright-pa120',
        category: 'cooler',
        name: 'Thermalright Peerless Assassin 120 SE',
        brand: 'Thermalright',
        price: 37.99,
        image: 'assets/images/cooler.svg',
        specs: 'Aire Doble Torre • 6 Heatpipes de cobre • 2x Ventiladores 120mm PWM',
        supportedSockets: ['AM5', 'AM4', 'LGA1700'],
        maxTdp: 245,
        type: 'Aire',
        description: 'El disipador por aire más galardonado. Rinde a la par de disipadores que triplican su costo.'
    },
    {
        id: 'cooler-noctua-nh-d15',
        category: 'cooler',
        name: 'Noctua NH-D15 chromax.black',
        brand: 'Noctua',
        price: 119.99,
        image: 'assets/images/cooler.svg',
        specs: 'Aire Doble Torre • 2x NF-A15 140mm • Acabado Premium Negro Mate',
        supportedSockets: ['AM5', 'AM4', 'LGA1700'],
        maxTdp: 260,
        type: 'Aire',
        description: 'Silencio acústico legendario austriaco y durabilidad inquebrantable de más de 10 años.'
    },

    // ==========================================
    // FUENTE DE PODER (PSU)
    // ==========================================
    {
        id: 'psu-corsair-rm850x',
        category: 'psu',
        name: 'Corsair RM850x Shift 850W 80+ Gold',
        brand: 'Corsair',
        price: 149.99,
        image: 'assets/images/psu.svg',
        specs: '850 Watts • Certificación 80 Plus Gold • Full Modular • Conector ATX 3.0 PCIe 5.0 12VHPWR',
        wattage: 850,
        efficiency: '80+ Gold',
        modular: 'Full Modular',
        description: 'Conexiones modulares laterales revolucionarias y compatibilidad total con la serie RTX 4000.'
    },
    {
        id: 'psu-msi-a750gl',
        category: 'psu',
        name: 'MSI MAG A750GL 750W 80+ Gold',
        brand: 'MSI',
        price: 99.99,
        image: 'assets/images/psu.svg',
        specs: '750 Watts • 80 Plus Gold • Full Modular • Cable PCIe 5.0 nativo de 16 pines',
        wattage: 750,
        efficiency: '80+ Gold',
        modular: 'Full Modular',
        description: 'Fuente compacta de 750W de alta eficiencia lista para cualquier GPU de gama media/alta.'
    },
    {
        id: 'psu-corsair-rm1000x',
        category: 'psu',
        name: 'Corsair RM1000x 1000W 80+ Gold',
        brand: 'Corsair',
        price: 189.99,
        image: 'assets/images/psu.svg',
        specs: '1000 Watts • 80 Plus Gold • Full Modular • Capacitores japoneses 105°C',
        wattage: 1000,
        efficiency: '80+ Gold',
        modular: 'Full Modular',
        description: 'Energía limpia y holgada para combinaciones de RTX 4090 o i9 sin preocuparse por picos de tensión.'
    },
    {
        id: 'psu-seasonic-1200',
        category: 'psu',
        name: 'Seasonic Vertex GX-1200 1200W 80+ Gold',
        brand: 'Seasonic',
        price: 249.99,
        image: 'assets/images/psu.svg',
        specs: '1200 Watts • 80 Plus Gold • Estándar ATX 3.0 • Garantía 10 Años',
        wattage: 1200,
        efficiency: '80+ Gold',
        modular: 'Full Modular',
        description: 'El fabricante más prestigioso del mundo garantizando máxima estabilidad para hardware extremo.'
    },
    {
        id: 'psu-evga-600br',
        category: 'psu',
        name: 'EVGA 600 BR 600W 80+ Bronze',
        brand: 'EVGA',
        price: 54.99,
        image: 'assets/images/psu.svg',
        specs: '600 Watts • Certificación 80 Plus Bronze • Ventilador silencioso de 120mm',
        wattage: 600,
        efficiency: '80+ Bronze',
        modular: 'No Modular',
        description: 'Fuente sólida y accesible para configuraciones económicas con RTX 4060 o RX 7600.'
    },
    {
        id: 'psu-tt-500w',
        category: 'psu',
        name: 'Thermaltake Smart 500W 80+ White',
        brand: 'Thermaltake',
        price: 39.99,
        image: 'assets/images/psu.svg',
        specs: '500 Watts • 80 Plus White • Protecciones OPP/OVP/SCP',
        wattage: 500,
        efficiency: '80+ White',
        modular: 'No Modular',
        description: 'Potencia justa y económica para armados gamer básicos de entrada.'
    },

    // ==========================================
    // GABINETE (CASE)
    // ==========================================
    {
        id: 'case-corsair-4000d',
        category: 'case',
        name: 'Corsair 4000D Airflow Mid-Tower',
        brand: 'Corsair',
        price: 89.99,
        image: 'assets/images/case.svg',
        specs: 'Mid-Tower • Frontal Mesh de alto flujo • Cristal Templado • Soporta hasta ATX • GPU hasta 360mm',
        supportedMotherboards: ['ATX', 'Micro-ATX', 'Mini-ITX'],
        maxGpuLength: 360,
        color: 'Negro',
        description: 'El gabinete más recomendado del mundo por su ventilación excepcional y gestión de cables RapidRoute.'
    },
    {
        id: 'case-nzxt-h9-flow',
        category: 'case',
        name: 'NZXT H9 Flow Dual-Chamber',
        brand: 'NZXT',
        price: 159.99,
        image: 'assets/images/case.svg',
        specs: 'Dual-Chamber • Cristal panorámico envolvente sin pilar frontal • Soporta radiadores 360mm • GPU hasta 435mm',
        supportedMotherboards: ['ATX', 'Micro-ATX', 'Mini-ITX'],
        maxGpuLength: 435,
        color: 'Negro',
        description: 'Vista panorámica impecable estilo pecera para exhibir los componentes con flujo de aire optimizado.'
    },
    {
        id: 'case-lianli-o11d',
        category: 'case',
        name: 'Lian Li O11 Dynamic EVO',
        brand: 'Lian Li',
        price: 149.99,
        image: 'assets/images/case.svg',
        specs: 'Modular Mid-Tower • Vidrio templado dual • Chasis reversible • GPU hasta 422mm',
        supportedMotherboards: ['ATX', 'Micro-ATX', 'Mini-ITX'],
        maxGpuLength: 422,
        color: 'Blanco',
        description: 'El estándar de oro para configuraciones de exhibición y refrigeración líquida personalizada.'
    },
    {
        id: 'case-fractal-north',
        category: 'case',
        name: 'Fractal Design North Mesh Wood',
        brand: 'Fractal Design',
        price: 139.99,
        image: 'assets/images/case.svg',
        specs: 'Mid-Tower con madera de nogal real • Malla lateral transpirable • GPU hasta 355mm',
        supportedMotherboards: ['ATX', 'Micro-ATX', 'Mini-ITX'],
        maxGpuLength: 355,
        color: 'Negro / Madera Nogal',
        description: 'Diseño nórdico sofisticado que combina acabados naturales con excelente ingeniería térmica.'
    },
    {
        id: 'case-deepcool-cc560',
        category: 'case',
        name: 'DeepCool CC560 V2 con 4 Ventiladores LED',
        brand: 'DeepCool',
        price: 59.99,
        image: 'assets/images/case.svg',
        specs: 'Mid-Tower • Incluye 4 ventiladores LED preinstalados • Cristal templado • GPU hasta 370mm',
        supportedMotherboards: ['ATX', 'Micro-ATX'],
        maxGpuLength: 370,
        color: 'Negro',
        description: 'Excelente relación valor con 4 ventiladores incluidos para que no tengas que gastar en refrigeración extra.'
    }
];

// Presets destacados para cargar rápidamente ensambles óptimos
const PRESET_BUILDS = [
    {
        id: 'preset-entry',
        title: 'Gamer Entrada 1080p',
        badge: 'Económico & Eficiente',
        targetResolution: '1080p Ultra / 144Hz',
        description: 'Configuración balanceada de máximo ahorro. Ideal para juegos competitivos (Valorant, CS2, Fortnite, LoL, Warzone).',
        totalPrice: 724.94,
        components: {
            cpu: 'cpu-r5-5600x',
            motherboard: 'mb-b550m-tuf',
            gpu: 'gpu-rtx-4060',
            ram: 'ram-kingston-ddr4-16',
            storage: 'ssd-wd-sn770-1tb',
            cooler: 'cooler-thermalright-pa120',
            psu: 'psu-evga-600br',
            case: 'case-deepcool-cc560'
        }
    },
    {
        id: 'preset-mid',
        title: 'Gamer Competitivo 1440p',
        badge: 'Más Popular',
        targetResolution: '1440p (2K) Ultra / 165Hz',
        description: 'La configuración gaming definitiva en relación potencia/precio con la plataforma AM5 y la impresionante RTX 4070 Super.',
        totalPrice: 1729.93,
        components: {
            cpu: 'cpu-r7-7800x3d',
            motherboard: 'mb-b650-strix',
            gpu: 'gpu-rtx-4070-s',
            ram: 'ram-corsair-ddr5-32',
            storage: 'ssd-samsung-990pro-2tb',
            cooler: 'cooler-deepcool-lt720',
            psu: 'psu-msi-a750gl',
            case: 'case-corsair-4000d'
        }
    },
    {
        id: 'preset-extreme',
        title: 'Ultra Entusiasta 4K & Workstation',
        badge: 'Máximo Poder',
        targetResolution: '4K Ultra + Ray Tracing / 120+ FPS',
        description: 'La máquina definitiva sin límites para renderizado profesional, inteligencia artificial local y gaming 4K sin compromisos.',
        totalPrice: 3828.93,
        components: {
            cpu: 'cpu-i9-14900k',
            motherboard: 'mb-z790-aorus-master',
            gpu: 'gpu-rtx-4090',
            ram: 'ram-kingston-ddr5-64',
            storage: 'ssd-crucial-t700-2tb',
            cooler: 'cooler-corsair-h150i',
            psu: 'psu-seasonic-1200',
            case: 'case-nzxt-h9-flow'
        }
    }
];

