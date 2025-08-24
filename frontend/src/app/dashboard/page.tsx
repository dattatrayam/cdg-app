"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import api from "@/lib/axios";

interface Dashboard {
  dashboardId: string;
  dataSourceId?: string;
}

interface DataSource {
  id: string;
  name: string;
  description?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [recent, setRecent] = useState<Dashboard[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>("");

  // Fetch recent dashboards
  useEffect(() => {
    api.get("/api/dashboards").then((res) => setRecent(res.data));
  }, []);

  // Fetch available data sources
  useEffect(() => {
    api.get("/api/data-sources").then((res) => {
      setDataSources(res.data);
      if (res.data.length > 0) setSelectedSource(res.data[0].id);
    });
  }, []);

  const startNewChat = async () => {
    if (!selectedSource) return;
    const res = await api.post("/api/dashboards", { dataSourceId: selectedSource });
    router.push(`/dashboard/${res.data.dashboardId}`);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* <Sidebar /> */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky" sx={{ zIndex: 1201 }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Conversational Dashboard Generator
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Welcome back 👋
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">Start New Chat</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Begin a new conversation with the AI to generate dashboards.
                  </Typography>

                  <FormControl fullWidth sx={{ mt: 2 }}>
                     <Typography variant="h6">Select Data Source</Typography>
                    <Select
                      labelId="datasource-label"
                      value={selectedSource}
                      onChange={(e) => setSelectedSource(e.target.value)}
                    >
                      {dataSources.map((ds) => (
                        <MenuItem key={ds.id} value={ds.id}>
                          {ds.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    sx={{ mt: 2 }}
                    variant="contained"
                    onClick={startNewChat}
                    disabled={!selectedSource}
                  >
                    Start
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">Recent Conversations</Typography>
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    {recent.map((d) => (
                      <Grid item key={d.dashboardId}>
                        <Button
                          variant="outlined"
                          onClick={() =>
                            router.push(`/dashboard/${d.dashboardId}`)
                          }
                        >
                          {d.dashboardId} {d.dataSourceId ? `(${d.dataSourceId})` : ""}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
