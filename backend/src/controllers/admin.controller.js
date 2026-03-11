import { asyncHandler } from "../utils/asyncHandler.js";
import * as adminService from "../services/admin.service.js";

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const data = await adminService.getDashboardStats();
  res.json({ success: true, data });
});

export const listBookings = asyncHandler(async (req, res) => {
  const data = await adminService.listBookings(req.query);
  res.json({ success: true, data });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const data = await adminService.updateBookingStatus(req.params.id, req.body);
  res.json({ success: true, data });
});

export const listServices = asyncHandler(async (_req, res) => {
  const data = await adminService.listServices();
  res.json({ success: true, data });
});

export const createService = asyncHandler(async (req, res) => {
  const data = await adminService.createService(req.body);
  res.status(201).json({ success: true, data });
});

export const updateService = asyncHandler(async (req, res) => {
  const data = await adminService.updateService(req.params.id, req.body);
  res.json({ success: true, data });
});

export const toggleService = asyncHandler(async (req, res) => {
  const data = await adminService.toggleService(req.params.id);
  res.json({ success: true, data });
});

export const listStaff = asyncHandler(async (_req, res) => {
  const data = await adminService.listStaff();
  res.json({ success: true, data });
});

export const createStaff = asyncHandler(async (req, res) => {
  const data = await adminService.createStaff(req.body);
  res.status(201).json({ success: true, data });
});

export const updateStaff = asyncHandler(async (req, res) => {
  const data = await adminService.updateStaff(req.params.id, req.body);
  res.json({ success: true, data });
});

export const toggleStaff = asyncHandler(async (req, res) => {
  const data = await adminService.toggleStaff(req.params.id);
  res.json({ success: true, data });
});