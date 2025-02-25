import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

type Conversion = {
  _id: string;
  initialValue: number;
  initialUnit: string;
  resultValue: number;
  resultUnit: string;
  createdAt: Date;
};

const initialState = {
  conversions: [] as Conversion[],
  loading: false,
  error: undefined as string | undefined,
};

const uri = import.meta.env.VITE_BACKEND_URI;

export const addConversion = createAsyncThunk<
  Conversion,
  Omit<Conversion, "_id" | "createdAt">,
  { rejectValue: string }
>("conversions/addConversion", async (newConversion, { rejectWithValue }) => {
  try {
    const response = await fetch(`${uri}/conversions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newConversion),
    });
    if (!response.ok) throw new Error("Failed to add conversion");
    return await response.json();
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
  }
});

export const fetchConversions = createAsyncThunk<Conversion[], void, { rejectValue: string }>(
  "conversions/fetchConversions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${uri}/conversions`);
      if (!response.ok) throw new Error("Failed to fetch conversions");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const deleteConversion = createAsyncThunk<string, string, { rejectValue: string }>(
  "conversions/deleteConversion",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${uri}/conversions/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete conversion");
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

const conversionsSlice = createSlice({
  name: "conversions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ADD CONVERSION
      .addCase(addConversion.pending, (state) => {
        state.error = undefined;
      })
      .addCase(addConversion.fulfilled, (state, action: PayloadAction<Conversion>) => {
        state.conversions.push(action.payload);
      })
      .addCase(addConversion.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to add conversion";
      })

      // FETCH CONVERSIONS
      .addCase(fetchConversions.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchConversions.fulfilled, (state, action: PayloadAction<Conversion[]>) => {
        state.loading = false;
        state.conversions = action.payload;
      })
      .addCase(fetchConversions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load conversions";
      })

      // DELETE CONVERSION
      .addCase(deleteConversion.pending, (state) => {
        state.error = undefined;
      })
      .addCase(deleteConversion.fulfilled, (state, action: PayloadAction<string>) => {
        state.conversions = state.conversions.filter((conv) => conv._id !== action.payload);
      })
      .addCase(deleteConversion.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to delete conversion";
      });
  },
});

export default conversionsSlice.reducer;
