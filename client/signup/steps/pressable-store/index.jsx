/**
 * External dependencies
 */
import React from 'react';
import EmailValidator from 'email-validator';

/**
 * Internal dependencies
 */
import StepWrapper from 'signup/step-wrapper';
import Gridicon from 'components/gridicon';

import LoggedOutForm from 'components/logged-out-form';
import LoggedOutFormFooter from 'components/logged-out-form/footer';
import LoggedOutFormLinks from 'components/logged-out-form/links';
import LoggedOutFormLinkItem from 'components/logged-out-form/link-item';
import FormTextInput from 'components/forms/form-text-input';
import FormInputValidation from 'components/forms/form-input-validation';
import FormButton from 'components/forms/form-button';
import FormLabel from 'components/forms/form-label';
import FormSectionHeading from 'components/forms/form-section-heading';

import renderHeroImage from './hero-image';

export default React.createClass( {
	displayName: 'PressableStoreStep',

	propTypes: {
		stepName: React.PropTypes.string.isRequired,
		goToNextStep: React.PropTypes.func.isRequired,
		signupDependencies: React.PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			email: '',
			valid: false,
			error: null,
		};
	},

	getDefaultProps() {
		return {};
	},

	componentDidMount() {
		if ( this._input ) {
			this._input.focus();
		}
	},

	onEmailChange( event ) {
		const email = event.target.value;
		const valid = EmailValidator.validate( email );
		this.setState( {
			email,
			valid,
		} );
		if ( this.state.error && valid ) {
			this.setState( {
				error: null,
			} );
		}
	},

	onSubmit( event ) {
		event.preventDefault();

		if ( ! this.state.valid ) {
			this.setState( {
				error: this.translate( 'Please enter a valid email address' ),
			} );
			return;
		}

		window.location.href = `https://my.pressable.com/signup/five-sites?email=${ encodeURIComponent( this.state.email ) }&wp-ecommerce=true`;
	},

	renderStoreForm() {
		return (
			<div>
				<LoggedOutForm className="pressable-store__form">
					{ renderHeroImage() }

					<FormSectionHeading className="pressable-store__heading">{ this.translate( 'Get your store for as low as $25 / month' ) }</FormSectionHeading>
					<p className="pressable-store__copy">{ this.translate( 'We\'ve partnered with Pressable, a top-notch WordPress hosting provider, and WooCommerce, the go-to eCommerce solution for WordPress, to make setting up your store a snap.' ) }</p>

					<LoggedOutFormFooter>
						<FormLabel for="email">{ this.translate( 'Start by entering your email address:' ) }</FormLabel>
						<div className="pressable-store__form-fields">
							<FormTextInput ref={ ( input ) => this._input = input } isError={ this.state.error } isValid={ this.state.valid } onChange={ this.onEmailChange } className="pressable-store__form-email is-spaced" type="email" placeholder="Email Address" name="email" />
							<FormButton onClick={ this.onSubmit } className="pressable-store__form-submit">{ this.translate( 'Get started on Pressable' ) }</FormButton>
						</div>
						{ this.state.error && <FormInputValidation isError={ true } text={ this.state.error } /> }
					</LoggedOutFormFooter>
				</LoggedOutForm>
				<LoggedOutFormLinks>
					<LoggedOutFormLinkItem className="pressable-store__privacy-policy" target="__blank" href="https://pressable.com/legal/privacy-policy/">
						{ this.translate( 'Pressable Privacy Policy', { comment: '“Pressable” is the name of a WordPress.org hosting provider' } ) } <Gridicon icon="external" size={ 12 } />
					</LoggedOutFormLinkItem>
				</LoggedOutFormLinks>
			</div>
		);
	},

	render() {
		return (
			<StepWrapper
				fallbackHeaderText={ this.translate( 'Create your WordPress Store' ) }
				fallbackSubHeaderText={ this.translate( 'Our partners at Pressable and WooCommerce are here for you' ) }
				subHeaderText={ this.translate( 'Baz' ) }
				stepContent={ this.renderStoreForm() }
				{ ...this.props }
				goToNextStep={ undefined } />
		);
	}
} );
