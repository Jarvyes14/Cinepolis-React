import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function IconButton({ icon, href, label }) {
    return (
        <Link className="icon-button bg-[#244180] pr-2 pl-2 pt-1 pb-1 rounded-md" to={href} aria-label={label}>
            <FontAwesomeIcon icon={icon} />
        </Link>
    );
}
