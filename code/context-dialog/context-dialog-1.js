/*
 *		context-menu-1.js    2024-04-09    usp
 *		Non-module script. Opens a context dialog window.
 *		Repo: https://github.com/bassmationcode/prj-context-menu
 */

"use strict" ;
	// The namespace for the package.
if ( typeof Synesis === "undefined" ) var Synesis = { } ;
if ( ! Synesis.Page ) Synesis.Page = { } ;
	// Holds a list of context dialogs with associated information, event handlers, ...
Synesis.Page.contextDialogRegistry = { } ;
	// Points to the currently open dialog.
Synesis.Page.activeContextDialogDescriptor = null ;
	// Points to the element on which the context dialog is shown.
Synesis.Page.activeContextElement = null ;
	// Points to the active context parent element
Synesis.Page.activeContextParent = null ;

/** 
*	Registers a context dialog and its event handlers.
*	@param {string} dialogid - ID of the context dialog element
*	@param {function} [onopen] - called before the dialog is opened
*	@param {function} [onclose] - called before the dialog is closed.
*
*/ Synesis.Page.registerContextDialog = function ( dialogid, onopen=null, onclose=null ) {
	//	Find the dialog element
	const dialog = document.getElementById( dialogid );
	//	Create a registry entry
	this.contextDialogRegistry[ dialogid ] = {
		dialog : dialog ,		// element id of the dialog
		onopen : onopen ,	// called when before the dialog is opened
		onclose : onclose		// called when the dialog is closed
		} ;
	if ( ! dialog.querySelector( "[data-close-dialog]" )) dialog.toggleAttribute( "data-dialog-autoclose", true );
	// Register a click event handler to close the dialog
	dialog.addEventListener( "click" , evt => {
		// Find the dialog container element
		const dialog = evt.target.closest( ".context-dialog" );
		if ( ! dialog.hasAttribute( "data-dialog-autoclose" ) && ! evt.target.hasAttribute( "data-close-dialog" )) return;
		//	Notify caller about dialog closing
		if ( Synesis.Page.contextDialogRegistry[dialog.id].onclose( evt, dialog ) === false ) return ;
		Synesis.Page.closeContextDialog( );
		} ) ;
	} ;
/** Untility function */ Synesis.Page.closeContextDialog = function ( ) {
	//	Close the active context dialog if open.
	if ( ! Synesis.Page.activeContextDialogDescriptor ) return ;
	Synesis.Page.activeContextDialogDescriptor.dialog.style.visibility = "hidden" ;
	console.log( "Context dialog closed" );
	Synesis.Page.activeContextDialogDescriptor = null ;
	Synesis.Page.activeContextElement = null ;
	Synesis.Page.activeContextParent = null ;
	} ;
/** Script init code */ ( function ( ) {
	//	Register event handler to open a context dialog
	document.addEventListener( "contextmenu", evt => {
		//	Find the context dialog id
		Synesis.Page.activeContextElement = evt.target ;
		Synesis.Page.activeContextParent = evt.target.closest( "[data-contextdialog-id-parent]" )
		let dialogid = evt.target.getAttribute( "data-contextdialog-id" );
		if ( ! dialogid ) dialogid = Synesis.Page.activeContextParent?.getAttribute( "data-contextdialog-id-parent" );
		if ( ! dialogid ) return Synesis.Page.closeContextDialog( );
		//	Position the dialog.
		evt.preventDefault( );
		const descriptor = Synesis.Page.activeContextDialogDescriptor = Synesis.Page.contextDialogRegistry[ dialogid ];
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
		//	Open the dialog.
		if ( descriptor.onopen( evt, dialog ) === false ) return Synesis.Page.closeContextDialog( );
		dialog.style.visibility = "visible" ;
		} ) ;
	//	Add a click event handler to the document 
	//	to catch clicks outside the context dialog.
	document.addEventListener( "click", evt => {
		if ( evt.target.tagName === "A" ) return ;
		Synesis.Page.closeContextDialog( );
		} ) ;
	} ) ( ) ;


