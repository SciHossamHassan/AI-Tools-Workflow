import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { PersistConfig } from 'redux-persist';

// Authenticated User Slice
const authenticatedUserSlice = createSlice({
  name: 'authenticated_user',
  initialState: null as {
    user_id: string;
    email: string;
    token: string;
    first_name?: string;
    last_name?: string;
  } | null,
  reducers: {
    login: (state, action: PayloadAction<{ user_id: string; email: string; token: string; first_name?: string; last_name?: string; }>) => {
      return { ...action.payload };
    },
    logout: () => {
      return null;
    },
  },
});

// AI Tool Filters Slice
const aiToolFiltersSlice = createSlice({
  name: 'ai_tool_filters',
  initialState: {
    pricing: '',
    tags: '',
    ease_of_use: '',
    search_text: '',
  } as {
    pricing?: string;
    tags?: string;
    ease_of_use?: string;
    search_text?: string;
  },
  reducers: {
    setFilters: (state, action: PayloadAction<{
      pricing?: string;
      tags?: string;
      ease_of_use?: string;
      search_text?: string;
    }>) => {
      return { ...action.payload };
    },
    resetFilters: () => {
      return {
        pricing: '',
        tags: '',
        ease_of_use: '',
        search_text: '',
      };
    },
  },
});

// Workflow In Progress Slice
const workflowInProgressSlice = createSlice({
  name: 'workflow_in_progress',
  initialState: {
    workflow_id: undefined,
    title: '',
    category: '',
    description: '',
    nodes: [] as {
      node_id: string;
      title: string;
      description: string;
      ai_tool_suggestions: any[];
    }[],
    is_template: false,
  } as {
    workflow_id?: string;
    title?: string;
    category?: string;
    description?: string;
    nodes: Array<{
      node_id: string;
      title: string;
      description: string;
      ai_tool_suggestions: any[];
    }>;
    is_template: boolean;
  },
  reducers: {
    setWorkflowMeta: (state, action: PayloadAction<{
      title?: string;
      category?: string;
      description?: string;
      is_template?: boolean;
    }>) => {
      if(action.payload.title) state.title = action.payload.title;
      if(action.payload.category) state.category = action.payload.category;
      if(action.payload.description) state.description = action.payload.description;
      if(action.payload.is_template !== undefined) state.is_template = action.payload.is_template;
    },
    addNode: (state, action: PayloadAction<{
      node_id: string;
      title: string;
      description: string;
      ai_tool_suggestions?: any[];
    }>) => {
      state.nodes.push({ ...action.payload, ai_tool_suggestions: action.payload.ai_tool_suggestions || [] });
    },
    removeNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter(node => node.node_id !== action.payload);
    },
    resetWorkflow: () => {
      return {
        workflow_id: undefined,
        title: '',
        category: '',
        description: '',
        nodes: [],
        is_template: false,
      };
    },
  },
});

// Reducers Combined
const rootReducer = combineReducers({
  authenticated_user: authenticatedUserSlice.reducer,
  ai_tool_filters: aiToolFiltersSlice.reducer,
  workflow_in_progress: workflowInProgressSlice.reducer,
});

// Redux Persist Config
const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage,
  whitelist: ['authenticated_user', 'workflow_in_progress'], // Only persist user auth and active workflows
};

// Create Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Persistor
export const persistor = persistStore(store);

// Action exports
export const { login, logout } = authenticatedUserSlice.actions;
export const { setFilters, resetFilters } = aiToolFiltersSlice.actions;
export const { setWorkflowMeta, addNode, removeNode, resetWorkflow } = workflowInProgressSlice.actions;

// Export the store as default
export default store;

// Types for dispatch and global state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;