export default async function IDGenerater(lastIdNumber, subString) {
    function generateNextID(lastIdNumber) {
        const newId = lastIdNumber + 1; // Increment the last generated ID
        const paddedID = newId.toString().padStart(4, '0'); // Pad with zeros to ensure it's 4 digits
        return `${subString}${paddedID}`;
    }

    // Example usage:
    const nextID = await generateNextID(lastIdNumber);
    return nextID

}