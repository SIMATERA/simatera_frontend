/**
 * Format tanggal ke format Indonesia (DD MMMM YYYY)
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} - Tanggal yang sudah diformat
 */
export const formatDate = (date) => {
    if (!date) return '-';

    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };

    try {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('id-ID', options);
    } catch (error) {
        console.error('Error formatting date:', error);
        return date.toString();
    }
};

/**
 * Format tanggal dan waktu ke format Indonesia (DD MMMM YYYY, HH:MM)
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} - Tanggal dan waktu yang sudah diformat
 */
export const formatDateTime = (date) => {
    if (!date) return '-';

    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    try {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('id-ID', options);
    } catch (error) {
        console.error('Error formatting date time:', error);
        return date.toString();
    }
};

/**
 * Format tanggal ke format singkat (DD/MM/YYYY)
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} - Tanggal yang sudah diformat
 */
export const formatShortDate = (date) => {
    if (!date) return '-';

    try {
        const dateObj = new Date(date);
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();

        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error('Error formatting short date:', error);
        return date.toString();
    }
}; 