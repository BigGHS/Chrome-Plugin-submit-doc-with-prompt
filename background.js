// this is the background code...
// console.log('background running');
chrome.browserAction.onClicked.addListener(buttonClicked);
let counter = 0;

function buttonClicked(tab) {
    let msg = {
        txt: "button clicked",
        num: counter
    }
    counter = counter + 1;
    //    console.log(counter);
    chrome.tabs.sendMessage(tab.id, msg);
}