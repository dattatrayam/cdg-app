"use client";
import { Box, Button, Container, Typography, Grid, Paper } from "@mui/material";
import Link from "next/link";

export default function LandingPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box textAlign="center" sx={{ mb: 8 }}>
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          Conversational Dashboard Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Turn your questions into live dashboards using AI + BigQuery
        </Typography>
        <Button
          component={Link}
          href="/dashboard"
          variant="contained"
          size="large"
          sx={{ mt: 4 }}
        >
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4}>
        {["Ask in natural language", "AI-powered insights", "Auto-generated dashboards"].map(
          (feature, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  {feature}
                </Typography>
                <Typography color="text.secondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
              </Paper>
            </Grid>
          )
        )}
      </Grid>
    </Container>
  );
}
