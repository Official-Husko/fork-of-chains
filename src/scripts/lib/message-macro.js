// message macro, by chapel (with help from T.M. Edwards); for sugarcube 2
// version 1.0.1
// see the documentation: https://github.com/ChapelR/custom-macros-for-sugarcube-2#message-macro

// MIT License (see LICENSE)
// NOTE: heavily modified

//intialize namespace
setup.messageMacro = {};

// default text option:
setup.messageMacro.default = 'Help';

const regex_named_args = /^(\w+)=(.*)$/

/**
 * <<message>> macro
 *   usage: <<message '<ontext>' '<offtext>'? 'btn'? '<arg>=<value>'*>>
 * 
 *   <ontext>: text to show in the link when closed
 *   <offtext>: text to show in the link when open (optional, defaults to ontext)
 *  'btn': if present, generate an html button (<button/>) instead of a link (<a/>)
 * 
 *   also accepts zero or more named args as 'arg=value':
 *     'target=<<.somecssclass': 
 *       Relative path of the html element to attach the opened child to
 *       See setup.querySelectorRelative for more info on paths
 * 
 *     'class=somecssclass':
 *       CSS class(es) to apply to the generated element (<a>/<button>)
 */ 
Macro.add('message', {
    tags    : null,
    handler : function () {
        const message  = this.payload[0].contents;
        const $wrapper = $(document.createElement('span'));
        const $link    = $(document.createElement(this.args.includes('btn') ? 'button' : 'a'))
        
        let offText = null // text to show in the link when closed
        let onText = null // text to show in the link when open

        const named_args = {}
        
        for (const arg of this.args) {
            if (typeof arg !== "string")
                continue

            const match = arg.match(regex_named_args)
            if (match)
                named_args[match[1]] = match[2]
            else if (arg !== 'btn')
                if (!offText) // first non-special argument (btn/target) is off text
                    offText = arg
                else // second is on text
                    onText = arg
        }

        offText = offText || setup.messageMacro.default

        if (named_args.class)
            $link.addClass(named_args.class)

        const containerPath = named_args.target // relative path to target container

        // if no opened link text is provided, used the same as when closed
        // special case: "(+)" opened link text will be "(-)", unless otherwise specified
        onText = onText || (offText === '(+)' ? '(–)' : offText)

        let $content = containerPath ? null : $(document.createElement('span'))
        $link
            .wiki(offText)
            .ariaClick( this.createShadowWrapper( function () {
                if (!$content && containerPath) {
                    // if using containerId, create the element lazily (otherwise parent might not exist yet)
                    $content = $(document.createElement('span'))

                    const container = setup.querySelectorRelative($wrapper.get(0), containerPath)
                    if (container)
                        $(container).append($content)
                }

                if (!$content)
                    return

                if ($wrapper.hasClass('open')) {
                    if (onText !== offText)
                        $link
                            .empty()
                            .wiki(offText);
                    $content
                        .css('display', 'none')
                        .empty();
                }
                else {
                    if (onText !== offText)
                        $link
                            .empty()
                            .wiki(onText);
                    $content
                        .css('display', 'block')
                        .wiki(message);
                }

                $wrapper.toggleClass('open');
            }));

        $wrapper
            .attr('id', 'macro-' + this.name + '-' + this.args.join('').replace(/[^A-Za-z0-9]/g, ''))
            .addClass('message-text')
            .append($link)

        if ($content)
            $wrapper.append($content)

        $wrapper.appendTo(this.output)
    }
});