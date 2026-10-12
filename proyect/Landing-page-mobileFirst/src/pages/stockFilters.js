// Datos derivados y lógica de filtrado para /obras-en-stock.
// No toca src/objects/paintings.jsx: técnica, forma y tamaño se deducen de los campos existentes.

export const STATUS_OPTIONS = [
    { value: 'all', label: 'Todas' },
    { value: 'available', label: 'Disponibles' },
    { value: 'sold', label: 'Vendidas' },
];

export const TECHNIQUE_OPTIONS = ['Acrílico', 'Acrílico con espátula', 'Acuarela'];
export const SHAPE_OPTIONS = ['Cuadrada', 'Rectangular', 'Circular'];

export const SORT_OPTIONS = [
    { value: 'default', label: 'Destacadas' },
    { value: 'size-desc', label: 'Tamaño: de mayor a menor' },
    { value: 'size-asc', label: 'Tamaño: de menor a mayor' },
    { value: 'name', label: 'Nombre: A a Z' },
];

export const normalize = (text) =>
    (text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

const getTechnique = (p) => {
    const d = normalize(p.description);
    if (d.includes('acuarela')) return 'Acuarela';
    if (d.includes('espatula')) return 'Acrílico con espátula';
    return 'Acrílico';
};

const getDimensions = (p) => {
    const match = /^(\d+)\s*x\s*(\d+)$/i.exec((p.size || '').trim());
    return match ? [Number(match[1]), Number(match[2])] : null;
};

const getShape = (p) => {
    if (normalize(p.description).includes('circular')) return 'Circular';
    const dims = getDimensions(p);
    if (!dims) return null;
    return dims[0] === dims[1] ? 'Cuadrada' : 'Rectangular';
};

// Superficie en cm² (los circulares se calculan con el diámetro de la descripción).
const getArea = (p) => {
    const dims = getDimensions(p);
    if (dims) return dims[0] * dims[1];
    const diameter = /di[aá]metro:\s*(\d+)/i.exec(p.description || '');
    return diameter ? Math.round(Math.PI * (Number(diameter[1]) / 2) ** 2) : null;
};

// Medida legible: "80 × 60 cm", "Ø 52 cm" (circulares) o null si no hay dato.
const getSizeLabel = (p) => {
    const dims = getDimensions(p);
    if (dims) return `${dims[0]} × ${dims[1]} cm`;
    const diameter = /di[aá]metro:\s*(\d+)/i.exec(p.description || '');
    return diameter ? `Ø ${diameter[1]} cm` : null;
};

export const enrich = (list) =>
    list.map((p, index) => ({
        ...p,
        index,
        technique: getTechnique(p),
        shape: getShape(p),
        area: getArea(p),
        sizeLabel: getSizeLabel(p),
        discounted: Boolean(p.offer) && !p.sold,
    }));

export const DEFAULT_FILTERS = { q: '', status: 'all', technique: '', shape: '', discount: false, sort: 'default' };

export const applyFilters = (items, { q, status, technique, shape, discount, sort }) => {
    const query = normalize(q);
    const result = items.filter((p) => {
        if (status === 'available' && p.sold) return false;
        if (status === 'sold' && !p.sold) return false;
        if (technique && p.technique !== technique) return false;
        if (shape && p.shape !== shape) return false;
        if (discount && !p.discounted) return false;
        if (query && !normalize(`${p.name} ${p.description} ${p.technique}`).includes(query)) return false;
        return true;
    });

    const bySize = (dir) => (a, b) => {
        if (a.area === null && b.area === null) return a.index - b.index;
        if (a.area === null) return 1;
        if (b.area === null) return -1;
        return (a.area - b.area) * dir || a.index - b.index;
    };

    if (sort === 'size-desc') result.sort(bySize(-1));
    else if (sort === 'size-asc') result.sort(bySize(1));
    else if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    return result;
};
