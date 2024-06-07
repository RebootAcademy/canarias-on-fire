const Location = require('../models/location.model')

const createLocation = async (req, res) => {
  try {
    const newLocation = await Location.create(req.body)
    res.status(201).json({
      success: true,
      message: 'Location succesfully created.',
      result: newLocation,
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error creating location.',
      description: error.message,
    });
  }
}

const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find()
    res.status(200).json({
      success: true,
      message: 'Locations successfully fetched.',
      result: locations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error getting locations.',
      description: error.message,
    });
  }
}

const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Location successfully fetched.',
      result: location,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error getting location.',
      description: error.message,
    });
  }
}

const updateLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Location successfully updated.',
      result: location,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error updating location.',
      description: error.message,
    });
  }
}

const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found.',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Location successfully deleted.',
      result: location,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting location.',
      description: error.message,
    });
  }
}

module.exports = {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
}