import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Schedule() {
  const navigate = useNavigate();

  // Redirect to main page with schedule view
  useEffect(() => {
    navigate("/?view=schedule");
  }, [navigate]);

  return null;
}
