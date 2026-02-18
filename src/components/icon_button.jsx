import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function IconButton({ icon, href, label }) {
    return (
        <a className="icon-button bg-[#244180] pr-2 pl-2 pt-1 pb-1 rounded-md" href={href} aria-label={label}>
            <FontAwesomeIcon icon={icon} />
        </a>
    );
}
