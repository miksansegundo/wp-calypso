/**
 * External dependencies
 */
import takeRight from 'lodash/takeRight';

/**
 * Internal dependencies
 */
import {
	GUIDED_TOUR_SHOW,
	GUIDED_TOUR_UPDATE,
	THEMES_RECEIVE,
	PREVIEW_IS_SHOWING,
	ROUTE_SET,
} from 'state/action-types';

const relevantTypes = {
	GUIDED_TOUR_SHOW,
	GUIDED_TOUR_UPDATE,
	THEMES_RECEIVE,
	PREVIEW_IS_SHOWING,
	ROUTE_SET: ( { path } ) => 0 === path.indexOf( '/design' ),
};

const isRelevantAction = ( action ) =>
	relevantTypes.hasOwnProperty( action.type ) &&
	( typeof relevantTypes[ action.type ] !== 'function' ||
		relevantTypes[ action.type ]( action ) );

const newAction = ( action ) => ( {
	...action, timestamp: Date.now()
} );

const maybeAdd = ( state, action ) =>
	action ? [ ...state, action ] : state;

export default ( state = [], action ) =>
	isRelevantAction( action )
		? takeRight( maybeAdd( state, newAction( action ) ), 50 )
		: state;
