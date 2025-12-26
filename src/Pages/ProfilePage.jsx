import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLogOut,
  FiLoader,
  FiRefreshCw,
  FiEdit2,
  FiCheck,
  FiMapPin,
  FiHome,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";

// ✅ RTK Query (SOURCE OF TRUTH)
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../Services/authApi";

// ✅ Redux only for logout
import { logout } from "../Redux/authSlice";

/* -----------------------------
   Helper: map profile → form
------------------------------ */
const mapProfileToForm = (profile) => ({
  firstName: profile?.firstName || "",
  lastName: profile?.lastName || "",
  email: profile?.email || "",
  phoneNumber: profile?.phone || "", // API returns 'phone' field
});

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, accessToken } = useSelector(
    (state) => state.auth
  );

  // ==========================
  // ✅ RTK QUERY (single source)
  // ==========================
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated || !accessToken,
  });

  const [updateProfile, { isLoading: updateLoading }] =
    useUpdateProfileMutation();

  // ==========================
  // LOCAL STATE
  // ==========================
  const [isEditing, setIsEditing] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState(
    mapProfileToForm(profile)
  );
  const [addresses, setAddresses] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    addressLine1: "",
    city: "",
    state: "",
    pinCode: "",
  });

  /* -----------------------------
     Auth Guard
  ------------------------------ */
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      navigate("/");
    }
  }, [isAuthenticated, accessToken, navigate]);

  /* -----------------------------
     Sync profile → form and addresses
  ------------------------------ */
  useEffect(() => {
    if (profile && !isEditing) {
      setFormData(mapProfileToForm(profile));
      setAddresses(profile.addresses || []);
    }
  }, [profile, isEditing]);

  /* -----------------------------
     Handlers
  ------------------------------ */
  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/");
    window.location.reload();
  }, [dispatch, navigate]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleEditClick = () => {
    setIsEditing(true);
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdateError(null);
    setUpdateSuccess(false);
    setIsAddingAddress(false);
    setEditingAddressId(null);
    if (profile) {
      setFormData(mapProfileToForm(profile));
      setAddresses(profile.addresses || []);
    }
    setNewAddress({
      name: "",
      addressLine1: "",
      city: "",
      state: "",
      pinCode: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateError(null);

    try {
      // Prepare payload with addresses
      const payload = {
        ...formData,
        addresses: addresses.filter(addr =>
          addr.name && addr.addressLine1 && addr.city && addr.state && addr.pinCode
        ),
      };

      await updateProfile(payload).unwrap();
      setUpdateSuccess(true);
      setIsEditing(false);
      setIsAddingAddress(false);
      setEditingAddressId(null);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      setUpdateError(
        err?.data?.message ||
          "Failed to update profile. Please try again."
      );
    }
  };

  /* -----------------------------
     Address Handlers
  ------------------------------ */
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = () => {
    if (
      newAddress.name &&
      newAddress.addressLine1 &&
      newAddress.city &&
      newAddress.state &&
      newAddress.pinCode
    ) {
      setAddresses((prev) => [...prev, { ...newAddress }]);
      setNewAddress({
        name: "",
        addressLine1: "",
        city: "",
        state: "",
        pinCode: "",
      });
      setIsAddingAddress(false);
    }
  };

  const handleEditAddress = (index) => {
    setEditingAddressId(index);
    setNewAddress(addresses[index]);
  };

  const handleUpdateAddress = () => {
    if (
      newAddress.name &&
      newAddress.addressLine1 &&
      newAddress.city &&
      newAddress.state &&
      newAddress.pinCode
    ) {
      const updatedAddresses = [...addresses];
      updatedAddresses[editingAddressId] = { ...newAddress };
      setAddresses(updatedAddresses);
      setNewAddress({
        name: "",
        addressLine1: "",
        city: "",
        state: "",
        pinCode: "",
      });
      setEditingAddressId(null);
    }
  };

  const handleDeleteAddress = (index) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancelAddressEdit = () => {
    setIsAddingAddress(false);
    setEditingAddressId(null);
    setNewAddress({
      name: "",
      addressLine1: "",
      city: "",
      state: "",
      pinCode: "",
    });
  };

  /* -----------------------------
     Loading
  ------------------------------ */
  if (isLoading && !profile) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative font-slab"
        style={{
          backgroundImage: `url('./assets/ProdBgImg.png')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="relative z-10">
          <FiLoader className="animate-spin text-[#8B3A4A]" size={40} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-12 relative font-slab"
      style={{
        backgroundImage: `url('./assets/ProdBgImg.png')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/60"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-script font-bold text-[#8B3A4A] mb-2">
            My Profile
          </h1>
          <p className="text-sm text-gray-600">
            <Link to="/" className="text-[#8B3A4A] hover:underline">
              Home
            </Link>{" "}
            / Profile
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/90 rounded-xl shadow-md p-8">
          {/* Avatar & Edit Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C48B9F] to-[#8B3A4A] flex items-center justify-center shadow-lg">
                <FiUser size={36} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {profile?.firstName} {profile?.lastName}
                </h2>
                <p className="text-gray-600 text-sm">{profile?.email}</p>
              </div>
            </div>

            {!isEditing && profile && (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C48B9F] to-[#8B3A4A] text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <FiEdit2 size={16} />
                <span className="text-sm font-medium">Edit Profile</span>
              </button>
            )}
          </div>

          {/* Success Message */}
          {updateSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <FiCheck className="text-green-600" size={20} />
              <p className="text-green-700 font-medium">
                Profile updated successfully!
              </p>
            </div>
          )}

          {/* Error Messages */}
          {error && !isEditing && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 font-medium mb-2">
                Failed to load profile
              </p>
              <button
                onClick={handleRetry}
                className="text-red-600 text-sm flex items-center gap-2 hover:underline"
              >
                <FiRefreshCw size={14} /> Retry
              </button>
            </div>
          )}

          {updateError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 font-medium">{updateError}</p>
            </div>
          )}

          {/* View Mode */}
          {!isEditing && profile && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard
                  icon={FiUser}
                  label="First Name"
                  value={profile.firstName}
                />
                <InfoCard
                  icon={FiUser}
                  label="Last Name"
                  value={profile.lastName}
                />
                <InfoCard
                  icon={FiMail}
                  label="Email Address"
                  value={profile.email}
                />
                <InfoCard
                  icon={FiPhone}
                  label="Phone Number"
                  value={profile.phone}
                />
              </div>

              {/* Addresses Section */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiMapPin className="text-[#8B3A4A]" />
                  Addresses
                </h3>
                {profile.addresses && profile.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.addresses.map((address, index) => (
                      <div
                        key={address._id || index}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white rounded-lg">
                            <FiHome className="text-[#8B3A4A]" size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 mb-1">
                              {address.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.addressLine1}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} - {address.pinCode}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No addresses added yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {isEditing && (
            <form onSubmit={handleUpdateSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled
                />
                <FormInput
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>

              {/* Addresses Management Section */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FiMapPin className="text-[#8B3A4A]" />
                    Manage Addresses
                  </h3>
                  {!isAddingAddress && editingAddressId === null && (
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(true)}
                      className="px-4 py-2 bg-gradient-to-r from-[#C48B9F] to-[#8B3A4A] text-white text-sm rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      + Add Address
                    </button>
                  )}
                </div>

                {/* Existing Addresses */}
                {addresses.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    {addresses.map((address, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                      >
                        {editingAddressId === index ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormInput
                                label="Address Name"
                                name="name"
                                value={newAddress.name}
                                onChange={handleAddressChange}
                                required
                              />
                              <FormInput
                                label="Address Line"
                                name="addressLine1"
                                value={newAddress.addressLine1}
                                onChange={handleAddressChange}
                                required
                              />
                              <FormInput
                                label="City"
                                name="city"
                                value={newAddress.city}
                                onChange={handleAddressChange}
                                required
                              />
                              <FormInput
                                label="State"
                                name="state"
                                value={newAddress.state}
                                onChange={handleAddressChange}
                                required
                              />
                              <FormInput
                                label="Pin Code"
                                name="pinCode"
                                value={newAddress.pinCode}
                                onChange={handleAddressChange}
                                required
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={handleUpdateAddress}
                                className="px-4 py-2 bg-green-600 text-white text-sm rounded-full hover:bg-green-700 transition-all"
                              >
                                Update
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelAddressEdit}
                                className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded-full hover:bg-gray-400 transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-white rounded-lg">
                                <FiHome className="text-[#8B3A4A]" size={20} />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800 mb-1">
                                  {address.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {address.addressLine1}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {address.city}, {address.state} - {address.pinCode}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditAddress(index)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              >
                                <FiEdit2 size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(index)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Address Form */}
                {isAddingAddress && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4">Add New Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        label="Address Name"
                        name="name"
                        value={newAddress.name}
                        onChange={handleAddressChange}
                        required
                      />
                      <FormInput
                        label="Address Line"
                        name="addressLine1"
                        value={newAddress.addressLine1}
                        onChange={handleAddressChange}
                        required
                      />
                      <FormInput
                        label="City"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        required
                      />
                      <FormInput
                        label="State"
                        name="state"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        required
                      />
                      <FormInput
                        label="Pin Code"
                        name="pinCode"
                        value={newAddress.pinCode}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        type="button"
                        onClick={handleAddAddress}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-full hover:bg-green-700 transition-all"
                      >
                        Add Address
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelAddressEdit}
                        className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded-full hover:bg-gray-400 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-[#C48B9F] to-[#8B3A4A] text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50"
                >
                  {updateLoading ? "Updating..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Logout Button */}
          {!isEditing && (
            <>
              <div className="my-8 border-t border-gray-200" />
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* -----------------------------
   Reusable Info Card Component
------------------------------ */
const InfoCard = ({ icon: Icon, label, value, fullWidth }) => (
  <div className={`${fullWidth ? 'md:col-span-2' : ''} bg-gray-50 rounded-xl p-4 border border-gray-200`}>
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="p-2 bg-white rounded-lg">
          <Icon className="text-[#8B3A4A]" size={20} />
        </div>
      )}
      <div className="flex-1">
        <p className="text-xs uppercase font-semibold text-gray-500 mb-1">
          {label}
        </p>
        <p className="text-gray-800 font-medium">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  </div>
);

/* -----------------------------
   Reusable Form Input Component
------------------------------ */
const FormInput = ({ label, fullWidth, ...props }) => (
  <div className={fullWidth ? 'md:col-span-2' : ''}>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {props.required && <span className="text-red-500">*</span>}
    </label>
    <input
      {...props}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A4A] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
  </div>
);

export default ProfilePage;
