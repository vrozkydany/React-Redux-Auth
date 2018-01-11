import React from "react";
import timezone from "../../data/timezone";
import map from "lodash/map";
import PropTypes from 'prop-types';
import classnames from "classnames";
import validateInput from "../../../server/shared/validations/signup";
import TextFieldGroup from "../common/textFielGroup";

export default class SignupForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      timezone: "",
      errors: {},
      isLoading: false,
      invalid: false
    }
    
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.checkUserExists = this.checkUserExists.bind(this);
  }

  onChange(e){
    this.setState({ [e.target.name]: e.target.value});
  }

  isValid(){
    const {errors, isValid} = validateInput(this.state);

    if(!isValid){
      this.setState({ errors });
    }

    return isValid;
  }
  
  checkUserExists(e){
    const field = e.target.name;
    const val = e.target.value;
    if(val != ""){
      this.props.isUserExists(val).then(res => {
        let errors = this.state.errors;
        let invalid;
        if(res.data.user){
          errors[field] = "There is user with such " + field;
          invalid = true;
        }else{
          errors[field] = "";
          invalid = false;
        }
        this.setState({ errors, invalid });
      });
    }
  }

  onSubmit(e){
    e.preventDefault();

    if(this.isValid()){
      this.setState({ errors: {}, isLoading: true });
      console.log(this.state);
      this.props.userSignupRequest(this.state).then(
        () => {
          this.props.addFlashMessage({
            type: "success",
            text: "You signed up successfully"
          });
          this.context.router.history.push("/");
        })
        .catch(
          (error) => 
            this.setState({errors: error, isLoading: true})
      );
    }
    
  }

  render(){
    const { errors } = this.state;
    const options = map(timezone, (val, key) => 
      <option value={val} key={val}>{key}</option>
    );
    return(
      <form onSubmit={this.onSubmit}>
        <h1>Join to our community</h1>

        <TextFieldGroup 
          error={errors.username}
          label="Username"
          onChange={this.onChange}
          checkUserExists={this.checkUserExists}
          value={this.state.username}
          field="username"
        />
        
        <TextFieldGroup 
          error={errors.email}
          label="Email"
          onChange={this.onChange}
          checkUserExists={this.checkUserExists}
          value={this.state.email}
          field="email"
        />

        <TextFieldGroup 
          error={errors.password}
          label="Password"
          onChange={this.onChange}
          value={this.state.password}
          field="password"
        />

        <TextFieldGroup 
          error={errors.passwordConfirmation}
          label="Confirm pass"
          onChange={this.onChange}
          value={this.state.passwordConfirmation}
          field="passwordConfirmation"
        />

        <div className={classnames("form-group",{"has-error": errors.timezone})}>
          <label className="control-label">Time zone</label>
          <select 
            value={this.state.timezone}
            onChange={this.onChange}
            name="timezone"
            className="form-control"  
          >
            <option value="" disabled>Choose Your timezone</option>
            {options}
          </select>
          {errors.timezone && <span className="help-block">{errors.timezone}</span>}
        </div>

        <div className="form-group">
          <button disabled={this.state.isLoading || this.state.invalid} className="btn btn-primary btn-lg">
          {/* <button className="btn btn-primary btn-lg"> */}
            Sign Up
          </button>
        </div>
      </form>
    );
  }
}

SignupForm.propTypes = {
  userSignupRequest: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  isUserExists: PropTypes.func.isRequired
}

SignupForm.contextTypes = {
  router: PropTypes.object.isRequired
}