/*
var boxes = document.getElementsByClassName('title-card');
for (var i = 0, l = boxes.length; i < l; i++)
{
    boxes[i].className = "title-card is-focused";
}
*/

document.addEventListener('keyup', doKeyPress, false);
window.addEventListener('keydown', eat_key, false);
window.addEventListener('keypress', eat_key, false);


function eat_key(e)
{
    if (e.keyCode ==  39)
    {
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
        return false;
    }
    else if(e.keyCode == 33)
    {
        e.preventDefault();
    }
    else if(e.keyCode == 34)
    {
        e.preventDefault();
    }

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
    var tabs = element.querySelectorAll('[tabindex="0"]');
    return tabs[0];
}


 /**
  * Select an item without jumping to a url
  */
function select_item(element)
{
    element.focus();
    element.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
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
  * Select all selectable child elements, its a delicate
  * balance between the links we want and don't want
  * and actually allowing what the user expects
  */
function get_selectable_children(element)
{
    var childhref = element.querySelectorAll('[href]:not([tabindex="-1"])')
    var childtabindex = element.querySelectorAll('[tabindex="0"],[tabindex="1"]')
    if(childtabindex.length > 1)
    {
        return childtabindex;
    }
    else if(childhref.length > childtabindex.length)
    {
        return childhref;
    }
    else if(childtabindex.length > 0)
    {
        return childtabindex;
    }
    else
    {
        return [element];
    }
}

function get_enabled_episodes(element)
{
    var showlist = element.querySelectorAll('button.iv-1yw_p');
    if(showlist.length > 0)
    {
        return showlist;
    }
    else
    {
        return [element];
    }
}

function click_more_episodes()
{
    var morebutton = document.querySelectorAll('button.iv-PfJvL.iv-gJlor.iv--qRAi.iv-25r32');
    if(morebutton.length > 0)
    {
        morebutton[0].click();
    }
    
}

function move_left_right(parent, offset)
{
    var cur_sel = get_selection(parent);
    if(cur_sel == null)
    {
        return;
    }
    // Get our title
    var selectable;
    // Get all selectable elements
    selectable = get_enabled_episodes(parent);
    
    var i;
    for(i=0; i<selectable.length; i++)
    {
        if(selectable[i] == cur_sel)
        {
            if((i + offset < selectable.length)&&(i + offset >=0 ))
            {
                select_item(selectable[i+offset]);
                return;
            }
            else
            {
                // just reasset the selection
                click_more_episodes();
                select_item(selectable[i]);
                return;
            }
        }
    }
}


function action_item()
{
    cur_sel = get_selection();
    if(cur_sel.tagName == "BUTTON")
    {
        cur_sel.click();
    }
    else if(cur_sel.href.length > 0)
    {
        window.location.replace(cur_sel.href);
    }
}

function doKeyPress(e)
{
    if(e.keyCode == 8)
    {
        /* backspace */
        window.history.back();
    }
    else if(e.keyCode == 13)
    {
        /* enter */
        
        action_item();
        return false;
    }
    else
    {
        var parent;
        var temp = document.querySelectorAll('[data-component=ShowEpisodesVideoList]');
        if(temp.length > 0)
        {
            // There is a list of episodes to choose from
            parent = document;
            if (e.keyCode ==  68)
            {
                /* d */
                move_left_right(parent,1);
                return false;
               
            }
            else if(e.keyCode == 65)
            {
                /* a */
                move_left_right(parent,-1);
                return false;

            }
        }
        else
        {
            temp = get_enabled_shows(document);
            if(temp.length > 0)
            {
                select_item(temp[0]);
            }
        }

    }
}

