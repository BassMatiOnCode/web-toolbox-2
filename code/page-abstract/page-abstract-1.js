/**
 *		page-abstract-1.js    2014-04-11    usp
 *		non-module script.
 */

"use strict" ;
if ( typeof Synesis === "undefined" ) var Synesis = { } ;
if ( ! Synesis.Page ) Synesis.Page = { } ;

/** Set the abstract paragraph on the page */
( function ( ) {
	const abstract = document.getElementById( "page-abstract" );
	if ( ! abstract ) return ;
	const description = document.querySelector( "meta[name='description']" );
	if ( ! description ) return ;
	// eslint-disable-next-line no-cond-assign
	if ( ( abstract.innerHTML = "" +  description.getAttribute( "content" )).length === 0 ) abstract.remove( ); 
	} ) ( ) ;