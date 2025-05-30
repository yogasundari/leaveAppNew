export default function EditLeaveType() {
  return (
    <div className="edit-leave-type-container">
      <h1>Edit Leave Type</h1>
      <form>
        <div className="form-group">
          <label htmlFor="leaveTypeName">Leave Type Name</label>
          <input type="text" id="leaveTypeName" name="leaveTypeName" required />
        </div>
        <div className="form-group">
          <label htmlFor="leaveTypeDescription">Description</label>
          <textarea id="leaveTypeDescription" name="leaveTypeDescription" required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="maxDays">Maximum Days Allowed</label>
          <input type="number" id="maxDays" name="maxDays" min="1" required />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}