export const dateConverter = (dateStr: string, dmhm?: boolean, onlyDate?: boolean): string => {
    const date = new Date(dateStr);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    if (dmhm) return `${day}/${month} ${hour}:${minute}`;
    if (onlyDate) return `${day}/${month}/${year}`;

    return `${day}/${month}/${year} ${hour}:${minute}`;
}