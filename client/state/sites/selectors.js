/** @ssr-ready **/

/**
 * External dependencies
 */
import map from 'lodash/map';
import filter from 'lodash/filter';
import some from 'lodash/some';
import includes from 'lodash/includes';

/**
 * Internal dependencies
 */
import createSelector from 'lib/create-selector';
import versionCompare from 'lib/version-compare';

/**
 * Returns a site object by its ID.
 *
 * @param  {Object}  state  Global state tree
 * @param  {Number}  siteId Site ID
 * @return {?Object}        Site object
 */
export function getSite( state, siteId ) {
	return state.sites.items[ siteId ] || null;
}

/**
 * Returns a filtered array of WordPress.com site IDs where a Jetpack site
 * exists in the set of sites with the same URL.
 *
 * @param  {Object}   state Global state tree
 * @return {Number[]}       WordPress.com site IDs with collisions
 */
export const getSiteCollisions = createSelector(
	( state ) => {
		return map( filter( state.sites.items, ( wpcomSite ) => {
			const wpcomSiteUrlSansProtocol = wpcomSite.URL.replace( /^https?:\/\//, '' );
			return ! wpcomSite.jetpack && some( state.sites.items, ( jetpackSite ) => {
				return (
					jetpackSite.jetpack &&
					wpcomSiteUrlSansProtocol === jetpackSite.URL.replace( /^https?:\/\//, '' )
				);
			} );
		} ), 'ID' );
	},
	( state ) => state.sites.items
);

/**
 * Returns true if a collision exists for the specified WordPress.com site ID.
 *
 * @param  {Object}  state  Global state tree
 * @param  {Number}  siteId Site ID
 * @return {Boolean}        Whether collision exists
 */
export function isSiteConflicting( state, siteId ) {
	return includes( getSiteCollisions( state ), siteId );
}

/**
 * Returns the slug for a site, or null if the site is unknown.
 *
 * @param  {Object}  state  Global state tree
 * @param  {Number}  siteId Site ID
 * @return {?String}        Site slug
 */
export function getSiteSlug( state, siteId ) {
	const site = getSite( state, siteId );
	if ( ! site ) {
		return null;
	}

	if ( ( site.options && site.options.is_redirect ) || isSiteConflicting( state, siteId ) ) {
		return site.options.unmapped_url.replace( /^https?:\/\//, '' );
	}

	return site.URL.replace( /^https?:\/\//, '' ).replace( /\//g, '::' );
}

/**
 * Returns the URL for a site's remote Jetpack wp-admin screen, or null if the
 * site is unknown, or not a Jetpack site.
 *
 * @param  {Object}  state  Global state tree
 * @param  {Number}  siteId Site ID
 * @return {?String}       Jetpack site's wp-admin screen
 */
export function getJetpackSiteRemoteManagementUrl( state, siteId ) {
	const site = getSite( state, siteId );

	if ( ! site || ! site.jetpack ) {
		return null;
	}

	const configure = versionCompare( site.options.jetpack_version, 3.4 ) ? 'manage' : 'json-api';
	return site.options.admin_url + 'admin.php?page=jetpack&configure=' + configure;
};