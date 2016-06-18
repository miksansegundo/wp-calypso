/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import {
	getSerializedStatsQuery,
	normalizers
} from '../utils';

describe( 'utils', () => {
	describe( 'getSerializedStatsQuery()', () => {
		it( 'should return a JSON string of a query', () => {
			const serializedQuery = getSerializedStatsQuery( {
				startDate: '2016-06-01',
				endDate: '2016-07-01'
			} );

			expect( serializedQuery ).to.equal( '[["endDate","2016-07-01"],["startDate","2016-06-01"]]' );
		} );

		it( 'should return the same JSON string of a query regardless of query object order', () => {
			const serializedQuery = getSerializedStatsQuery( {
				startDate: '2016-06-01',
				endDate: '2016-07-01'
			} );

			const serializedQueryTwo = getSerializedStatsQuery( {
				endDate: '2016-07-01',
				startDate: '2016-06-01'
			} );

			expect( serializedQuery ).to.eql( serializedQueryTwo );
		} );
	} );

	describe( 'normalizers', () => {
		describe( 'stats()', () => {
			it( 'should return null if no data is passed', () => {
				const parsedData = normalizers.stats();

				expect( parsedData ).to.be.null;
			} );

			it( 'should return null if data object is missing stats attribute', () => {
				const parsedData = normalizers.stats( { foo: false } );

				expect( parsedData ).to.be.null;
			} );

			it( 'should return parsed camelCased stats object', () => {
				const parsedData = normalizers.stats( { stats: {
					posts: 2,
					views: 300,
					visitors: 400,
					views_best_day: '2010-09-29',
					views_best_day_total: 100
				} } );

				expect( parsedData ).to.eql( {
					posts: 2,
					views: 300,
					visitors: 400,
					viewsBestDay: '2010-09-29',
					viewsBestDayTotal: 100
				} );
			} );
		} );

		describe( 'statsPublicize()', () => {
			it( 'should return an empty array if not data is passed', () => {
				const parsedData = normalizers.statsPublicize();

				expect( parsedData ).to.eql( [] );
			} );

			it( 'should return an empty array if not data has no services attribute', () => {
				const parsedData = normalizers.statsPublicize( { bad: [] } );

				expect( parsedData ).to.eql( [] );
			} );

			it( 'should return an a properly parsed services array', () => {
				const parsedData = normalizers.statsPublicize( {
					services: [ {
						service: 'twitter',
						followers: 528
					}, {
						service: 'facebook',
						followers: 282
					} ]
				} );

				expect( parsedData ).to.eql( [
					{
						label: 'Twitter',
						icon: 'https://secure.gravatar.com/blavatar/7905d1c4e12c54933a44d19fcd5f9356?s=48',
						value: 528
					}, {
						label: 'Facebook',
						icon: 'https://secure.gravatar.com/blavatar/2343ec78a04c6ea9d80806345d31fd78?s=48',
						value: 282
					}
				] );
			} );
		} );
	} );
} );
