/**
 * External dependencies
 */
import { localize } from 'i18n-calypso';
import noop from 'lodash/noop';
import React, { PropTypes } from 'react';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Gridicon from 'components/gridicon';
import classNames from 'classnames';
import { plansList } from 'lib/plans/constants';

function getLongestDescription( planName ) {
	if ( ! planName ) {
		return null;
	}
	const isJetpack = planName.indexOf( 'jetpack' ) === 0;
	const plans = Object.keys( plansList );

	return reduce(
		filter( plans, ( plan ) => {
			const isPlanJetpack = plan.indexOf( 'jetpack' ) === 0;
			return isJetpack ? isPlanJetpack : ! isPlanJetpack;
		} ),
		( longestDescription, plan ) => {
			const currentDescription = plansList[ plan ].getDescription();
			return currentDescription.length > longestDescription.length
				? currentDescription : longestDescription;
		},
		''
	);
}

const PlanFeaturesFooter = ( {
	available = true,
	current = false,
	description,
	onUpgradeClick = noop,
	planType,
	translate,
} ) => {
	const classes = classNames( 'plan-features__footer', { 'has-description': !! description } );
	const longestDescription = getLongestDescription( planType );
	return (
		<footer className={ classes }>
			{ description &&
				<p className="plan-features__footer-desc">
					<span className="plan-features__footer-desc-text">
						{ description }
					</span>
					<span className="plan-features__footer-desc-longest">
						{ longestDescription }
					</span>
				</p>
			}
			<div className="plan-features__footer-buttons">
				{
					current
						? <Button className="plan-features__footer-button is-current" disabled>
							<Gridicon size={ 18 } icon="checkmark" />
							{ translate( 'Your plan' ) }
						</Button>
						: <Button className="plan-features__footer-button" {
							...( available
								? { onClick: onUpgradeClick, primary: true }
								: { disabled: true } ) }>
							{ translate( 'Upgrade' ) }
						</Button>
				}
			</div>
		</footer>
	);
};

PlanFeaturesFooter.propTypes = {
	current: PropTypes.bool,
	available: PropTypes.bool,
	description: PropTypes.string,
	onUpgradeClick: PropTypes.func,
	planType: PropTypes.string
};

export default localize( PlanFeaturesFooter );
