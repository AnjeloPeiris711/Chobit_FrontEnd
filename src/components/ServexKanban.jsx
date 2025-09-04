import React, { useState, useEffect, useContext } from 'react';
import { Plus, MessageSquare, Paperclip, Eye, ArrowLeft, Users } from 'lucide-react';
import apiClient from '../utils/apiClient';
import { AuthContext } from '../context/AuthContext';

const KanbanBoard = ({ onBack }) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [processes, setProcesses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [staffRoleId, setStaffRoleId] = useState(null);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    priority: 'Design', 
    process_status: 'TO_DO', // Use process_status instead of processId
    assignedStaff: null 
  });

  useEffect(() => {
    fetchAllServices();
  }, []);

  useEffect(() => {
    if (selectedServiceId) {
      fetchProcesses();
      // fetchStaff();
      fetchTasks();
    } else {
      setProcesses([]);
      setTasks([]);
    }
  }, [selectedServiceId]);

  useEffect(() => {
    if (staffRoleId) {
      fetchStaff(staffRoleId);
    }
  }, [staffRoleId]);

  const fetchAllServices = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/service/Authority/services', token);
      const servicesData = response.data || response || [];
      setServices(servicesData);
      console.log('Services:', servicesData);
      
      if (servicesData.length > 0 && !selectedServiceId) {
        setSelectedServiceId(servicesData[0].id);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProcesses = async () => {
    if (!selectedServiceId) return;
    
    try {
      setLoading(true);
      const response = await apiClient.get(`/process/${selectedServiceId}`, token);
      const processData = response.data?.processes || [];
      
      const sortedProcesses = processData
        .filter(process => process.status === 'ACTIVE')
        .sort((a, b) => a.order - b.order);
      
      setProcesses(sortedProcesses);
      console.log('Processes:', sortedProcesses);
    } catch (error) {
      console.error('Error fetching processes:', error);
      setProcesses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async (roleId) => {
    try {
      const response = await apiClient.get(`/staff/staff-list/${roleId}`, token);
      const staffData = response.staff_list || [];
      setStaff(staffData);
      console.log('Staff:', staffData);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await apiClient.get(`/servicerequested/requested/${selectedServiceId}`, token);
      const tasksData = response.data || [];
      
      // Transform service requests to tasks with process_status
      const transformedTasks = tasksData.map(request => ({
        id: request.id,
        title: `Service Request - ${request.user.name}`,
        process_status: request.process_status || 'TO_DO', // Use process_status field
        priority: 'Service Request',
        date: new Date(request.appointment_date).toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        }),
        assignedStaff: null,
        comments: request.form_responses_count || 0,
        attachments: 0,
        // Store original service request data
        serviceRequest: request
      }));
      
      setTasks(transformedTasks);
      console.log('Transformed Tasks:', transformedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // // Fallback dummy data
      // setTasks([
      //   {
      //     id: 1,
      //     title: "iOS App home page",
      //     process_status: "TO_DO",
      //     priority: "Design",
      //     date: "15 Jul 2023",
      //     assignedStaff: { name: "John", avatar: "🧑‍💻", color: "bg-blue-500" },
      //     comments: 12,
      //     attachments: 8
      //   }
      // ]);
    }
  };

  const handleServiceChange = (serviceId) => {
    setSelectedServiceId(serviceId);
    setProcesses([]);
    setTasks([]);
  };

  // Get staff by role ID for a specific process
  const getStaffByProcess = (processName) => {
    const process = processes.find(p => p.process_name === processName);
    if (!process) return [];
    const roleId = process.assignedRole?.id;
    if (roleId !== staffRoleId) {
      setStaffRoleId(roleId); // Update staffRoleId to trigger the fetchStaff useEffect
    }
    console.log(staff);
    return staff;
  };

  // Create dynamic columns based on processes with default "TO_DO" column first
  const columns = [
    // Default "TO_DO" column
    {
      id: 'TO_DO',
      title: 'TO DO',
      processName: 'TO_DO',
      order: 0,
      count: tasks.filter(t => t.process_status === 'TO_DO').length,
      isDefault: true
    },
    // Process-based columns
    ...processes.map(process => ({
      id: process.process_name, // Use process name as ID
      title: process.process_name.toUpperCase(),
      processName: process.process_name,
      roleInfo: process.assignedRole,
      order: process.order + 1,
      count: tasks.filter(t => t.process_status === process.process_name).length
    }))
  ];

  const priorityColors = {
    'Design': 'bg-red-100 text-red-600',
    'Product': 'bg-blue-100 text-blue-600',
    'Checking': 'bg-teal-100 text-teal-600',
    'Development': 'bg-gray-100 text-gray-600',
    'Service Request': 'bg-green-100 text-green-600',
    'Wordpress': 'bg-green-100 text-green-600',
    'App': 'bg-blue-100 text-blue-600',
    'Web': 'bg-green-100 text-green-600',
    'Banner Design': 'bg-purple-100 text-purple-600'
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newProcessName) => {
    e.preventDefault();
    if (draggedTask) {
      try {
        // Update task's process_status
        const updatedTask = {
          ...draggedTask,
          process_status: newProcessName,
          assignedStaff: null // Reset staff assignment when moving to new process
        };

        // If this is a service request, update the service request
        if (draggedTask.serviceRequest) {
          await apiClient.put(`/servicerequested/requested/${draggedTask.id}`, {
            process_status: newProcessName
          }, token);
        }

        // Update local state
        setTasks(tasks.map(task =>
          task.id === draggedTask.id ? updatedTask : task
        ));
        setDraggedTask(null);
      } catch (error) {
        console.error('Error updating task:', error);
        // Still update local state for demo purposes
        setTasks(tasks.map(task =>
          task.id === draggedTask.id 
            ? { ...task, process_status: newProcessName, assignedStaff: null }
            : task
        ));
        setDraggedTask(null);
      }
    }
  };

  const addNewTask = async () => {
    if (newTask.title.trim()) {
      const task = {
        title: newTask.title,
        process_status: 'TO_DO', // Always start in TO_DO
        priority: newTask.priority,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        assignedStaff: null,
        comments: 0,
        attachments: 0
      };

      try {
        const response = await apiClient.post('/tasks', task, token);
        const createdTask = response.data?.data || { ...task, id: Date.now() };
        setTasks([...tasks, createdTask]);
      } catch (error) {
        console.error('Error creating task:', error);
        setTasks([...tasks, { ...task, id: Date.now() }]);
      }

      setNewTask({ title: '', priority: 'Design', process_status: 'TO_DO', assignedStaff: null });
      setShowAddModal(false);
    }
  };

  const assignStaffToTask = async (taskId, staffMember) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      
      // If this is a service request, update the service request
      if (task.serviceRequest) {
        await apiClient.put(`/servicerequested/assignStaff/${taskId}`, {
          assignedStaff: staffMember.id
        }, token);
      }

      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, assignedStaff: staffMember } : t
      ));
      setShowAssignModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error assigning staff:', error);
      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, assignedStaff: staffMember } : t
      ));
      setShowAssignModal(false);
      setSelectedTask(null);
    }
  };

  const TaskCard = ({ task }) => {
    const currentProcess = processes.find(p => p.process_name === task.process_status);
    const roleStaff = currentProcess ? getStaffByProcess(task.process_status) : [];
    
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-move"
      >
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority] || 'bg-gray-100 text-gray-600'}`}>
            {task.priority}
          </span>
          <span className="text-xs text-gray-500">{task.date}</span>
        </div>

        <h3 className="font-medium text-gray-900 mb-3 text-sm leading-tight">
          {task.title}
        </h3>

        {/* Process and Role Information */}
        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-1">
            Process: {task.process_status}
          </div>
          {currentProcess && (
            <div className="text-xs text-gray-500 mb-1">
              Role: {currentProcess.assignedRole?.staffroll}
            </div>
          )}
          {roleStaff.length > 0 && (
            <div className="text-xs text-gray-500">
              Available staff: {roleStaff.length}
            </div>
          )}
        </div>

        {/* Service Request Info */}
        {task.serviceRequest && (
          <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
            <div className="text-gray-600">User: {task.serviceRequest.user.name}</div>
            <div className="text-gray-500">Email: {task.serviceRequest.user.email}</div>
            <div className="text-gray-500">
              Appointment: {new Date(task.serviceRequest.appointment_date).toLocaleDateString()}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-gray-500">
              <MessageSquare size={14} className="mr-1" />
              <span className="text-xs">{task.comments}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Paperclip size={14} className="mr-1" />
              <span className="text-xs">{task.attachments}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Eye size={14} />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Staff Assignment Button - only show if task is in a process with staff */}
            {roleStaff.length > 0 && (
              <button
                onClick={() => {
                  setSelectedTask(task);
                  setShowAssignModal(true);
                }}
                className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                title="Assign Staff"
              >
                <Users size={12} className="text-gray-600" />
              </button>
            )}

            {/* Assigned Staff Display */}
            {task.assignedStaff ? (
              <div className={`w-8 h-8 ${task.assignedStaff.color || 'bg-blue-500'} rounded-full flex items-center justify-center text-white text-sm`}>
                {task.assignedStaff.avatar || task.assignedStaff.name?.charAt(0)}
              </div>
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Plus size={14} className="text-gray-500" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const selectedService = services.find(s => s.id === selectedServiceId);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={!selectedServiceId}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>

        {/* Service Selector */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Service
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a service...</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.service_name}
                </option>
              ))}
            </select>
            
            {selectedService && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {selectedService.service_icon && (
                    <img 
                      src={selectedService.service_icon.file_path} 
                      alt={selectedService.service_name}
                      className="w-8 h-8 rounded object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedService.service_name}</h3>
                    <p className="text-sm text-gray-600">{selectedService.note}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">
                        Fee: LKR {selectedService.service_fee_lrk}
                      </span>
                      <span className="text-xs text-gray-500">
                        Duration: {selectedService.slot_duration} min
                      </span>
                      <span className="text-xs text-gray-500">
                        Max People: {selectedService.max_people_per_slot}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Show message if no service selected */}
        {!selectedServiceId ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Please select a service to view the kanban board</p>
          </div>
        ) : columns.length === 1 ? ( // Only TO_DO column means no processes
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No processes found for the selected service</p>
          </div>
        ) : (
          /* Kanban Board */
          <div className="flex space-x-6 overflow-x-auto pb-6">
            {columns.map((column) => (
              <div
                key={column.id}
                className="flex-shrink-0 w-80"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.processName)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                      {column.title} ({column.count})
                    </h2>
                    {!column.isDefault && column.roleInfo && (
                      <p className="text-xs text-gray-500 mt-1">
                        Role: {column.roleInfo.staffroll}
                      </p>
                    )}
                    {column.isDefault && (
                      <p className="text-xs text-gray-500 mt-1">
                        New requests start here
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-300 rounded-lg p-3 min-h-96">
                  <div className="space-y-3">
                    {tasks
                      .filter(task => task.process_status === column.processName)
                      .map(task => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Task Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Add New Task</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Design">Design</option>
                    <option value="Development">Development</option>
                    <option value="Product">Product</option>
                    <option value="Checking">Checking</option>
                    <option value="Service Request">Service Request</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={addNewTask}
                  disabled={!newTask.title.trim()}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add Task
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewTask({ title: '', priority: 'Design', process_status: 'TO_DO', assignedStaff: null });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Staff Assignment Modal */}
        {showAssignModal && selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Assign Staff to Task</h3>
              <p className="text-sm text-gray-600 mb-4">
                Task: {selectedTask.title}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Process: {selectedTask.process_status}
              </p>

              <div className="space-y-3">
                {getStaffByProcess(selectedTask.process_status).map((staffMember) => (
                  <button
                    key={staffMember._id}
                    onClick={() => assignStaffToTask(selectedTask.id, staffMember)}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        {staffMember.avatar || staffMember.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{staffMember.name}</p>
                        <p className="text-sm text-gray-500">{staffMember.email}</p>
                      </div>
                    </div>
                  </button>
                ))}

                <button
                  onClick={() => assignStaffToTask(selectedTask.id, null)}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <Plus size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Unassigned</p>
                      <p className="text-sm text-gray-500">Remove staff assignment</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedTask(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;