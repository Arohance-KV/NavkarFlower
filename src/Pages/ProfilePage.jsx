import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLogOut,
  FiAlertCircle,
  FiLoader,
  FiRefreshCw,
  FiEdit2,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getProfile, logout, updateProfile } from "../Redux/authSlice";

/* -----------------------------
   Helper: Map user -> form data
------------------------------ */
const mapUserToForm = (user) => ({
  firstName: user?.firstName || "",
  lastName: user?.lastName || "",
  email: user?.email || "",
  phoneNumber: user?.phoneNumber || "",
  address: user?.address || "",
  city: user?.city || "",
  state: user?.state || "",
  zipCode: user?.zipCode || "",
});

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error, isAuthenticated, accessToken } = useSelector(
    (state) => state.auth
  );

  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState(mapUserToForm(null));

  /* -----------------------------
     Auth Guard + Fetch Profile
  ------------------------------ */
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      navigate("/");
      return;
    }

    if (!user) {
      dispatch(getProfile());
    }
  }, [isAuthenticated, accessToken, user, dispatch, navigate]);

  /* -----------------------------
     Sync form when user loads
  ------------------------------ */
  useEffect(() => {
    if (user && !isEditing) {
      setFormData(mapUserToForm(user));
    }
  }, [user, isEditing]);

  /* -----------------------------
     Handlers
  ------------------------------ */
  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/");
    window.location.reload();
  }, [dispatch, navigate]);

  const handleRetry = useCallback(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
    setUpdateError(null);
    setUpdateSuccess(false);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setUpdateError(null);
    setUpdateSuccess(false);
    if (user) setFormData(mapUserToForm(user));
  }, [user]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);

    try {
      await dispatch(updateProfile(formData)).unwrap();
      setUpdateSuccess(true);
      setIsEditing(false);

      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      setUpdateError(err || "Failed to update profile. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  /* -----------------------------
     Loading Screen
  ------------------------------ */
  if (loading && !user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
        style={{ backgroundImage: "url('/assets/ProdBgImg.png')" }}
      >
        <div className="absolute inset-0 bg-[#f6efe6]/80 backdrop-blur-sm" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <FiLoader className="animate-spin text-[#c9a47c]" size={48} />
          <p className="text-[#7b5a45] font-slab">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: "url('/assets/ProdBgImg.png')" }}
    >
      <div className="relative z-10 w-full max-w-2xl bg-[#fbf7f3] rounded-2xl shadow-2xl px-8 py-10 border border-[#eadfda]">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#c7a17a]/20 flex items-center justify-center">
            <FiUser size={36} className="text-[#7b4a2e]" />
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <h1 className="text-4xl font-script text-[#7b4a2e]">My Profile</h1>
          {!isEditing && user && (
            <button
              onClick={handleEditClick}
              className="p-2 hover:bg-[#eadfda] rounded-lg transition"
            >
              <FiEdit2 size={20} />
            </button>
          )}
        </div>

        {/* Success */}
        {updateSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
            <FiCheck className="text-green-600" />
            <p className="text-green-700 font-slab text-sm">
              Profile updated successfully!
            </p>
          </div>
        )}

        {/* Errors */}
        {error && !isEditing && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-slab text-sm">{error}</p>
            <button
              onClick={handleRetry}
              className="text-red-600 text-xs mt-2 flex items-center gap-1"
            >
              <FiRefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        {updateError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-slab text-sm">{updateError}</p>
          </div>
        )}

        {/* View Mode */}
        {!isEditing && user && (
          <div className="space-y-5 font-slab text-[#7b5a45]">
            <InfoRow icon={FiUser} label="Name" value={`${user.firstName} ${user.lastName}`} />
            <InfoRow icon={FiMail} label="Email" value={user.email} />
            <InfoRow icon={FiPhone} label="Phone" value={user.phoneNumber} />
            {user.address && <InfoRow icon={FiUser} label="Address" value={user.address} />}
            {user.city && <InfoRow icon={FiUser} label="City" value={user.city} />}
            {user.state && <InfoRow icon={FiUser} label="State" value={user.state} />}
            {user.zipCode && <InfoRow icon={FiUser} label="Zip Code" value={user.zipCode} />}
          </div>
        )}

        {/* Edit Mode */}
        {isEditing && (
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData).map(([key, value]) => (
                <input
                  key={key}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  placeholder={key.replace(/([A-Z])/g, " $1")}
                  className="px-4 py-2 rounded-lg border border-[#eadfda] font-slab"
                />
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={updateLoading}
                className="flex-1 bg-[#c9a47c] text-white py-3 rounded-lg"
              >
                {updateLoading ? "Updating..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-300 py-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {!isEditing && (
          <>
            <div className="my-8 border-t border-[#eadfda]" />
            <button
              onClick={handleLogout}
              className="w-full bg-[#c9a47c] text-white py-3 rounded-lg flex justify-center gap-2"
            >
              <FiLogOut /> Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* -----------------------------
   Reusable Info Row
------------------------------ */
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex gap-4 items-start">
    <Icon className="text-[#b8926d]" />
    <div>
      <p className="text-xs uppercase text-[#a67855]">{label}</p>
      <p>{value || "Not provided"}</p>
    </div>
  </div>
);

export default ProfilePage;
