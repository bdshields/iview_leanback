
document.addEventListener('keyup', doKeyPress, false);
window.addEventListener('keydown', eat_key, false);
window.addEventListener('keypress', eat_key, false);

window.addEventListener('load', onload, false);

function onload()
{
    select_item(get_selection());
}



function eat_key(e)
{
    if (e.keyCode ==  39)
    {
        e.preventDefault();
    }
    else if (e.keyCode ==  9)
    {
        /* Tab Key */
        e.preventDefault();
    }
    else if (e.keyCode ==  37)
    {
        e.preventDefault();
    }
    else if(e.keyCode == 38)
    {
        e.preventDefault();
    }
    else if(e.keyCode == 40)
    {
        e.preventDefault();
    }
    else if(e.keyCode == 13)
    {
        e.preventDefault();
    }
    else if(e.keyCode == 33)
    {
        e.preventDefault();
    }
    else if(e.keyCode == 34)
    {
        e.preventDefault();
    }
    else if(e.keyCode == 32)
    {
        /* space */
        e.preventDefault();
    }
    
}

function urlparam(param, value) {
    var n = value;
    var val = document.URL;
    var offset = val.indexOf(param);
    if(offset > 0 )
    {
        var url = val.substr(offset);
        n=parseInt(url.replace(param+"=",""));
    }
    return n;
}

function get_parent(elem, selector) 
{
	for ( ; elem && elem !== document; elem = elem.parentNode ) {
		if ( elem.matches( selector ) ) return elem;
	}
	return null;
};

function get_sibling(element, p_selector, s_selector)
{
    return get_parent(element, p_selector).querySelectorAll(s_selector);
}

function get_selectable_child(element)
{
    var tabs = element.querySelectorAll('a[href^="/show/"]');
    return tabs[0];
}


 /**
  * Select an item without jumping to a url
  */
function select_item(element)
{
    element.focus();
    if(element.hasAttribute('tabIndex'))
    {
        element.tabIndex = 1;
    }
    else
    {
        element.tabIndex = 2;
    }
    return;
}


var selectTmr = null;

 /**
  * Use this function to reassert the visible selection, sometimes it
  * disappears after a slide left or slide right
  */
function DelaySelect()
{
    // cancel any pending timer, and refresh it
    if (selectTmr != null)
    {
        clearTimeout(selectTmr);
    }
    selectTmr = window.setTimeout(onDelayedSelect, 1000);
}

function onDelayedSelect()
{
    var selection;
    var parent;
    selectTmr = null;
    selection = get_selection();
    select_item(selection);
    
    parent = get_parent(selection,".flickity-enabled");
    if(parent != null)
    {
        parent.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    }
}


/**
 *  Returns an actionable video
 */
function get_selection()
{
    var cur_sel;
    var active_flickity;
    // something already marked
    var select = document.querySelectorAll('[tabindex="1"]');
    if(select.length > 0)
    {
        cur_sel = select[0];
        cur_sel.tabIndex=0
        return cur_sel;
    }
    // something already marked
    var select = document.querySelectorAll('[tabindex="2"]');
    if(select.length > 0)
    {
        cur_sel = select[0];
        cur_sel.removeAttribute('tabIndex');
        return cur_sel;
    }
    // Look for a selected flickity
    active_flickity = document.activeElement;
    var select = document.querySelectorAll('[tabindex="3"]');
    if(select.length > 0)
    {
        active_flickity = select[0];
        active_flickity.removeAttribute('tabIndex');
    }
    // no titles to choose from
     cur_sel = get_enabled_shows(active_flickity)[0];

    return cur_sel;
}



 /**
  * Get list of enabled shows for current carasel
  */
function get_enabled_shows(element)
{
    var showlist = element.querySelectorAll('a[href^="/show/"].is-selected,.is-selected a[href^="/show/"]');
    if(showlist.length > 0)
    {
        return showlist;
    }
    else
    {
        return [element];
    }
}

function click_flickity_prev(element)
{
    var buttonlist = element.querySelectorAll('button.flickity-prev-next-button.previous:not([disabled])');
    if(buttonlist.length > 0)
    {
        element.tabIndex = 3;
        buttonlist[0].click();
        DelaySelect();
    }
}

function click_flickity_next(element)
{
    var buttonlist = element.querySelectorAll('button.flickity-prev-next-button.next:not([disabled])');
    if(buttonlist.length > 0)
    {
        element.tabIndex = 3;
        buttonlist[0].click();
        DelaySelect();
    }
}

 // -1 == left 
 //  1 == right

function move_left_right(offset)
{
    // Get our title
    var cur_sel = get_selection();
    var selectable;
    var row_parent = get_parent(cur_sel,".flickity-enabled");
    if(row_parent == null)
    {
        // Not sure what we are selecting, but try and do it gently
        // Get all selectable elements
        selectable = get_enabled_shows(document);
    }
    else
    {
        // Get all selectable elements
        selectable = get_enabled_shows(row_parent);
    }
    
    var i;
    for(i=0; i<selectable.length; i++)
    {
        if(selectable[i] == cur_sel)
        {
            if(offset == -1)
            {
                if(i > 0)
                {
                    select_item(selectable[i+offset]);
                }
                else
                {
                    click_flickity_prev(row_parent);
                }
            }
            else if(offset == 1)
            {
                if(i < (selectable.length - 1))
                {
                    select_item(selectable[i+offset]);
                }
                else
                {
                    click_flickity_next(row_parent);
                }
            }
            return;
        }
    }
}

function move_up_down(offset)
{
    var col = 0; // colum of current title
    
    // find the selectable element
    var cur_sel = get_selection();
    // get the parent for this row
    var parent = get_parent(cur_sel,".flickity-enabled");
    // Get all selectable elements
    var selectable = get_enabled_shows(parent);
    var i;
    for(i=0; i<selectable.length; i++)
    {
        if(selectable[i] == cur_sel)
        {
            col = i;
            break;
        }
    }
    
    // get all rows
    var sliders = document.getElementsByClassName("flickity-enabled");
    for(i=0; i<sliders.length; i++)
    {
        if(sliders[i] == parent)
        {
            // found the slider that matches the current selection
            if((i + offset >= 0)&&(i + offset < sliders.length))
            {
                selectable = get_enabled_shows(sliders[i + offset]);
                if(col >= selectable.length)
                {
                    col = selectable.length - 1;
                }
                select_item(selectable[col]);
                selectable[col].scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
                DelaySelect();
                return;
            }
        }
    }
}


var current_season = 0;
var season_tmr = null;

function season_timer()
{
    var season_menu = document.getElementsByClassName("nfDropDown");
    var selector;
    season_tmr = null;
    if(season_menu.length > 0)
    {
        selector = get_enabled_shows(season_menu[season_menu.length - 1]);
       
        if(selector.length > 1)
        {
            if(current_season < 1)
            {
                current_season = 1;
            }
            if(current_season >= selector.length)
            {
                current_season = selector.length-1;
            }
            // menu open, so timeout and select item
            select_item(selector[current_season]);
        }
    }
    DelaySelect();
}

function season_focus()
{
    var season_menu = document.getElementsByClassName("nfDropDown");
    var selector = get_enabled_shows(season_menu[season_menu.length - 1]);
    if(current_season < 1)
    {
        current_season = 1;
    }
    if(current_season >= selector.length)
    {
        current_season = selector.length-1;
    }
    selector[current_season].focus();
} 

function move_season(offset)
{
    var season_menu = document.getElementsByClassName("nfDropDown");
    var selector;
    if(season_menu.length > 0)
    {
        selector = get_enabled_shows(season_menu[season_menu.length - 1]);
        if(selector.length == 1)
        {
            // menu not open
            current_season += offset;
            select_item(selector[0]);
            window.setTimeout(season_focus, 100);
        }
        else if(selector.length > 1)
        {
            // menu open
            current_season += offset;
            if(current_season < 1)
            {
                current_season = 1;
            }
            if(current_season >= selector.length)
            {
                current_season = selector.length-1;
            }
            selector[current_season].focus();
        }
        if(season_tmr != null)
        {
            clearTimeout(season_tmr);
        }
        season_tmr = window.setTimeout(season_timer, 1000);
    }
    else
    {
        // no season menu, so advance the title menu
        move_title_menu(offset);
    }
    
}

function move_title_menu(offset)
{
    var menu = document.querySelectorAll(".menu");
    var i;
    if (menu.length == 0)
    {
        return;
    }
    // just incase there are multiple menus open, take the last one
    var options = menu[menu.length - 1].childNodes;
    for(i=0; i<options.length; i++)
    {
        if(options[i].className.indexOf("current") > 0)
        {
            if((i + offset >= 0)&&(i + offset < options.length))
            {
                get_selection();
                select_item(get_selectable_child(options[i+offset]));
                DelaySelect();
            }
            break;
        }
    }
}

function action_item()
{
    cur_sel = document.activeElement;
    if(cur_sel.tagName == "BUTTON")
    {
        cur_sel.click();
    }
    else if(cur_sel.href.length > 0)
    {
        window.location.href = cur_sel.href;
    }
}

function doKeyPress(e)
{
    if (e.keyCode ==  9)
    {
        /* Tab */
        if (e.shiftKey)
        {
            move_left_right(-1);
        }
        else
        {
            move_left_right(1);
        }
        return false;
       
    }
    else if (e.keyCode ==  68)
    {
        /* d */
        move_left_right(1);
        return false;
       
    }
    else if(e.keyCode == 65)
    {
        /* a */
        move_left_right(-1);
        
        return false;

    }
    else if(e.keyCode == 83)
    {
        /* s */
        move_up_down(1);
       
        return false;

    }
    else if(e.keyCode == 87)
    {
        /* w */
        move_up_down(-1);
        
        return false;

    }
    else if(e.keyCode == 13)
    {
        /* enter */
        action_item();
        return false;
    }
    else if(e.keyCode == 33)
    {
        /* page up */
        move_title_menu(-1)
    }
    else if(e.keyCode == 34)
    {
        /* page down */
        move_title_menu(1)
    }
    else if(e.keyCode == 219)
    {
        /* [ */
        move_season(-1)
    }
    else if(e.keyCode == 221)
    {
        /* ] */
        move_season(1)
    }
    else if(e.keyCode == 8)
    {
        /* backspace */
        window.history.back();
    }

}

