import { Link } from "react-router";
import "./PrivacyCheckbox.scss";

interface PrivacyCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  policyPath?: string;
  id?: string;
}

export function PrivacyCheckbox({
  checked,
  onChange,
  policyPath = "/integritetspolicy",
  id = "privacy-consent",
}: PrivacyCheckboxProps) {
  return (
    <div className="privacy-checkbox">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
      />
      <label htmlFor={id}>
        Jag godkänner att mina uppgifter används för att kontakta mig i enlighet
        med <Link to={policyPath}>integritetspolicyn</Link>.
      </label>
    </div>
  );
}

export default PrivacyCheckbox;
