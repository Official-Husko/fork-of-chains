/* Create the Right UI Bar. */
let $rightUiBar = $('<div id="right-ui-bar"></div>').insertAfter("#ui-bar");

let rightTray = $rightUiBar.append('<div id="right-ui-bar-tray"><button id="right-ui-bar-toggle" tabindex="0" title="Toggle the Right UI bar" aria-label="Toggle the Right UI bar" type="button"></button></div>');

let rightBody = $rightUiBar.append('<div id="right-ui-bar-body"></div>');

/* Attach the toggle button click. */
$rightUiBar.find('#right-ui-bar-toggle').ariaClick({label : "Toggle the Right UI bar"}, () => $rightUiBar.toggleClass('stowed'));

/* Automatically show the contents of the StoryRightSidebar passage in the right-ui-bar-body element. */
postrender["Display Right Sidebar Contents"] = function (content, taskName) {
	setPageElement('right-ui-bar-body', 'StoryRightSidebar');
};

if ($(window).width() < 1424) {
	$rightUiBar.toggleClass('stowed')
}
