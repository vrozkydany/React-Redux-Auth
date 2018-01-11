import React from "react";
import PropTypes from 'prop-types';
import classnames from "classnames";

const textFieldGroup = ({ field, value, label, error, type, onChange, checkUserExists }) => {
  return (
    <div className={classnames("form-group",{"has-error": error})}>
      <label className="control-label">{label}</label>
      <input 
        value={value}
        onChange={onChange}
        onBlur={checkUserExists}
        type={type}
        name={field}
        className="form-control"  
      />
      {error && <span className="help-block">{error}</span>}
    </div>
  );
}

textFieldGroup.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checkUserExists: PropTypes.func
}

textFieldGroup.defaultProps = {
  type: "text"
}

export default textFieldGroup;