export const createEventListener = (node, type, handler) => {
    node.addEventListener(type, handler);
    function unsubscribe() {
        node.removeEventListener(type, handler);
    }
    return unsubscribe;
};

export const calculateDistance = ([left, right]) => right - left;

export const convertToPercent = (width, value, max) => ((value / width) * max);

export const converPercentToPixels = (percent, width, max) => Math.round((percent * width) / max);
