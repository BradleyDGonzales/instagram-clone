const ConfirmationModal = ({ open, onCancel, deleteAccount}) => {
    if (!open) return null;
    return <div className="overlay">
    <div className="modalContainer">
        <div className="confirmationModalContent">
            <div className="textContent">
                <span>Are you sure you want to delete your account?</span>
            </div>
            <div className="deleteAccountBtnContainer">
                <button onClick={() => deleteAccount()} className="btnPrimary btn btn-danger">
                    Confirm
                </button>
                <button onClick={() => onCancel()} className="btnSecondary btn btn-secondary">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</div>
}
export default ConfirmationModal;