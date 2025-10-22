/**
 * GoAbroad 规划状态管理
 * 管理用户的留学规划、时间线、材料清单等
 * 
 * TODO: 后续开发时实现具体功能
 */

import { createSlice } from '@reduxjs/toolkit';

// 初始状态
const initialState = {
  // 用户规划列表
  plans: [],
  
  // 当前活跃的规划
  activePlan: null,
  
  // 时间线
  timeline: [],
  
  // 材料清单
  materials: [],
  
  // 任务列表
  tasks: [],
  
  // 加载状态
  loading: false,
  error: null,
};

// 创建 slice
const planningSlice = createSlice({
  name: 'planning',
  initialState,
  reducers: {
    // TODO: 实现具体的 reducers
    setPlans: (state, action) => {
      state.plans = action.payload;
    },
    
    setActivePlan: (state, action) => {
      state.activePlan = action.payload;
    },
    
    setTimeline: (state, action) => {
      state.timeline = action.payload;
    },
    
    setMaterials: (state, action) => {
      state.materials = action.payload;
    },
    
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

// 导出 actions
export const {
  setPlans,
  setActivePlan,
  setTimeline,
  setMaterials,
  setTasks,
  clearError,
} = planningSlice.actions;

// 导出 reducer
export default planningSlice.reducer;
