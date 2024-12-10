const ms = require("ms");

exports.currentDateTime = () => {
    const date = new Date();
    const currentDate = date.toLocaleDateString([], { hour12: true });
    return currentDate;
}
exports.futureDateTime = (futureDT) => {
    const currentDT = new Date();
    return new Date(currentDT.getTime() + ms(futureDT));
}