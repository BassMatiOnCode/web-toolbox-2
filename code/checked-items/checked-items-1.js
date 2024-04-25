/*
 *		checked-items-1.js    2024-04-08    usp
 *		Persistent checkboxes for instruction lists
 *		Repo: https://github.com/bassmationcode/web-toolbox-2/checked-items
 */

"use strict" ;

/**		Component init code
 *			Initialize persisted checkbox states
 */	
( function ( ) {
	// Initialize counter that generates local storage keys.
	let checkboxCount = 0 ;  // generates the checkbox id number
	//	Create context dialog
	const dialog = document.createElement( "DIV" );
	dialog.id = "data-checkeditems-contextdialog" ;
	dialog.className = "context-dialog" ;
	dialog.innerHTML = "<div name='clear-list'>clear list</div><div name='clear-all'>clear all</div>" ;
	document.body.appendChild( dialog );
	//	Register dialog with the context dialog component
	Synesis.ContextDialog.register( dialog.id, 
		evt => {	// dialogOpening: Check if the target element is a persisted checkbox.
			if ( evt.target.tagName !== "INPUT" || evt.target.getAttribute( "type" ) !== "checkbox" || evt.target.parentElement.parentElement !== Synesis.ContextDialog.activeParent ) return false ;
			}, 
		evt => {	// dialogClosing: check which context dialog element has been clicked and clear the appropriage checkboxes.
		let node ;
		switch ( evt.target.getAttribute( "name" )) {
			case "clear-all" : 
				node = document ;
				break;
			case "clear-list" : 
				node = Synesis.ContextDialog.activeParent ;
				break;
			}
		//	Setup a selector and find the affected checkboxes.
		//	This are all persisted checkbox elements under node which has been set above.
		for ( const checkbox of node.querySelectorAll( `[data-contextdialog-id="${dialog.id}"]   input[type="checkbox"][data-storage-key]` )) {
			checkbox.checked = false ;
			//	Change event must be raised manually.
			checkbox.dispatchEvent( new Event( "change" ));
			} 
		} ) ;

	//	Add a checkbox element to all checkable list items
	for ( const element of document.querySelectorAll( ".checked-items > LI, .checked-items > DT" )) {
		//	Create the checkbox element
		const checkbox = element.insertBefore( document.createElement( "INPUT" ), element.firstChild );
		checkbox.type = "checkbox" ;
		//	Add a storage key attribute
		const key = `checkbox-${++checkboxCount}`;
		checkbox.setAttribute( "data-storage-key", key );
		//	Init checkbox state from local storage	
		checkbox.checked = window.localStorage.getItem( key ) === "1" ;
		//	Add change event listener
		checkbox.addEventListener( "change" ,  evt => {
			//	Save the checkbox state in local storage.
			const key = `${evt.target.getAttribute( "data-storage-key" )}`;
			if ( evt.target.checked ) window.localStorage.setItem( key, "1" );
			else window.localStorage.removeItem( key );
			} );
		}
	} ) ( ) ;