/*
 *		context-menu-1.js    2024-04-09    usp
 *		Non-module script. Opens a context dialog window.
 *		Repo: https://github.com/bassmationcode/prj-context-menu
 */

"use strict" ;
	// The namespace for the package.
if ( typeof Synesis === "undefined" ) var Synesis = { } ;
if ( ! Synesis.ContextDialog ) Synesis.ContextDialog = { } ;

	// List of context dialog descriptors
Synesis.ContextDialog.registry = { } ;
	// Points to the currently open dialog:
Synesis.ContextDialog.activeDescriptor = null ;
	// Points to the element which received the right-click:
Synesis.ContextDialog.activeElement = null ;
	// Points to the active context parent element:
Synesis.ContextDialog.activeParent = null ;

/** register( )
*	Registers a context dialog and its associated open and close dialog event handlers.
*	@param {string} dialogid - ID of the context dialog element
*	@param {function} [dialogOpening] - called before the dialog is opened
*	@param {function} [dialogClosing] - called before the dialog is closed.
*
*/ Synesis.ContextDialog.register = function ( dialogid, dialogOpening=null, dialogClosing=null ) {
	//	Prevent duplicate keys
	if ( this.registry[ dialogid ] ) return console.error( "The dialog ID is already registered." );
	//	Find the dialog element
	const dialog = document.getElementById( dialogid );
	if ( ! dialog ) return console.error( `Context dialog ${dialogid} not found.` );
	//	Create a registry entry
	const descriptor = this.registry[ dialogid ] = {
		dialog : dialog ,		// element id of the dialog
		dialogOpening : dialogOpening ,	// called when before the dialog is opened
		dialogClosing : dialogClosing		// called when the dialog is closed
		} ;
	// Set the autoclose attribute on the dialog element if a click on any elemeny closes the dialog.
	if ( ! dialog.querySelector( "[data-contextdialog-close]" )) dialog.toggleAttribute( "data-contextdialog-autoclose", true );
	// Add a click event listener to the dialog element.
	dialog.addEventListener( "click" , evt => {
		// Find the dialog container element
		const descriptor = Synesis.ContextDialog.activeDescriptor;
		if ( ! descriptor.dialog.hasAttribute( "data-contextdialog-autoclose" ) && ! evt.target.hasAttribute( "data-contextdialog-close" )) return evt.stopPropagation();
		//	Notify caller about dialog closing
		if ( descriptor.dialogClosing && descriptor.dialogClosing( evt, dialog ) === false ) return ;
//		Synesis.ContextDialog.closeContextDialog( );
		} ) ;
	} ;
/**	closeContextDialog( )
 *	Hides the context dialog and clears the context state variables.
 *	
 */ Synesis.ContextDialog.closeContextDialog = function ( ) {
	//	Bail out if there is no active context dialog.
	if ( ! Synesis.ContextDialog.activeDescriptor ) return ;
	//	Hide dialog.
	Synesis.ContextDialog.activeDescriptor.dialog.style.visibility = "hidden" ;
	//	Reset state variables.
	Synesis.ContextDialog.activeDescriptor = null ;
	Synesis.ContextDialog.activeElement = null ;
	Synesis.ContextDialog.activeParent = null ;
	} ;
/** Script init code 
 *	Adds a contextment and click event listeners to the document to open and close a context dialog.
 *	
 */ ( function ( ) {
	//	Register contextmenu event handler
	document.addEventListener( "contextmenu", evt => {
		//	Find the context dialog id
		Synesis.ContextDialog.activeElement = evt.target.closest( "[data-contextdialog-id]" );
		const dialogid = Synesis.ContextDialog.activeElement?.getAttribute( "data-contextdialog-id" );
		//	Cancel if there is none.
		if ( ! dialogid ) return Synesis.ContextDialog.closeContextDialog( );
		//	Adjust pointers if it is a context parent element
		if ( Synesis.ContextDialog.activeElement.hasAttribute( "data-contextdialog-parent" )) {
			Synesis.ContextDialog.activeParent = Synesis.ContextDialog.activeElement;
			Synesis.ContextDialog.activeElement = evt.target;
			}
		//	Position the dialog.
		evt.preventDefault( );
		const descriptor = Synesis.ContextDialog.activeDescriptor = Synesis.ContextDialog.registry[ dialogid ];
		if ( ! descriptor ) return console.error( `Context dialog "${dialogid}" is not registered.` );
		const dialog = descriptor.dialog;
		let y = evt.target.getBoundingClientRect().top + window.visualViewport.pageTop;
		let x = evt.target.getBoundingClientRect().left + window.visualViewport.pageLeft;
		/*
		//	Adjust position
		if ( x < window.visualViewport.pageLeft ) x = window.visualViewport.pageLeft ;
		if ( y < window.visualViewport.pageTop ) y = window.visualViewport.pageTop ;
		if ( x + dialogbounds.width > window.visualViewport.width ) x = window.visualViewport.width - dialogbounds.width ;
		if ( y + dialogbounds.height > window.visualViewport.height ) y = window.visualViewport.height - dialogbounds.height ;
		*/
		dialog.style.left = x + "px";
		dialog.style.top = y + "px";
		//	Cancel opening if dialogOpening function returns false.
		if ( descriptor.dialogOpening && descriptor.dialogOpening( evt, dialog ) === false ) return Synesis.ContextDialog.closeContextDialog( );
		//	Open the dialog.
		dialog.style.visibility = "visible" ;
		} ) ;
	//	Add a click event handler to the document to catch clicks outside the context dialog.
	document.addEventListener( "click", evt => {
		if ( evt.target.tagName === "A" ) return ;
		Synesis.ContextDialog.closeContextDialog( );
		} ) ;
	} ) ( ) ;


