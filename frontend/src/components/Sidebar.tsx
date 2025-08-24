"use client";
import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import Link from "next/link";

export default function Sidebar() {
  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
      <List sx={{ width: 240, flexShrink: 0 }}>
        {[
          { label: "Dashboard", href: "/dashboard" },
        ].map((item) => (
          <ListItemButton component={Link} href={item.href} key={item.label}>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
