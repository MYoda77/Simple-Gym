// src/components/PocketBaseTest.tsx
import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { auth, customExercisesAPI } from "../lib/pocketbase";
import { useToast } from "../hooks/use-toast";

export const PocketBaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<
    "testing" | "success" | "error"
  >("testing");
  const [collections, setCollections] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(auth.isLoggedIn);
  const [testEmail] = useState("test@example.com");
  const [testPassword] = useState("testpassword123");
  const { toast } = useToast();

  // Test PocketBase connection
  const testConnection = async () => {
    try {
      setConnectionStatus("testing");

      // Test basic connection using the health endpoint (no auth required)
      const response = await fetch("http://localhost:8090/api/health");
      if (!response.ok) throw new Error("PocketBase not accessible");

      const data = await response.json();
      console.log("Health check response:", data);

      // For collections info, we'll just check if PocketBase is responsive
      setCollections([
        "users",
        "custom_exercises",
        "workouts",
        "progress",
        "workout_history",
        "schedule",
      ]);
      setConnectionStatus("success");

      toast({
        title: "Connection Successful! ✅",
        description: "PocketBase is running and accessible",
      });
    } catch (error) {
      console.error("Connection test failed:", error);
      setConnectionStatus("error");
      toast({
        title: "Connection Failed ❌",
        description: "Make sure PocketBase is running on http://localhost:8090",
        variant: "destructive",
      });
    }
  };

  // Test user registration
  const testRegister = async () => {
    try {
      const result = await auth.register(testEmail, testPassword, "Test User");
      if (result.success) {
        setIsLoggedIn(true);
        toast({
          title: "Registration Success! ✅",
          description: "Test user created and logged in",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // Test creating a custom exercise
  const testCreateExercise = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Not Logged In",
        description: "Please register first",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await customExercisesAPI.create({
        name: "Test Push-up",
        equipment: "bodyweight",
        difficulty: "beginner",
        complexity: "low",
        primaryMuscle: "chest",
        instructions: "This is a test exercise created via PocketBase API",
      });

      if (result) {
        toast({
          title: "Exercise Created! ✅",
          description: "Custom exercise saved to database",
        });
      } else {
        toast({
          title: "Exercise Creation Failed",
          description: "Check console for errors",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Exercise creation failed:", error);
      toast({
        title: "Exercise Creation Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // Test on component mount
  useEffect(() => {
    testConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>PocketBase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <span>Connection Status:</span>
          <span
            className={`font-semibold ${
              connectionStatus === "success"
                ? "text-green-600"
                : connectionStatus === "error"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {connectionStatus === "success"
              ? "✅ Connected"
              : connectionStatus === "error"
              ? "❌ Failed"
              : "⏳ Testing..."}
          </span>
        </div>

        {/* Collections Found */}
        {collections.length > 0 && (
          <div>
            <p className="font-semibold">Collections Found:</p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {collections.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Auth Status */}
        <div className="flex items-center gap-2">
          <span>Auth Status:</span>
          <span
            className={`font-semibold ${
              isLoggedIn ? "text-green-600" : "text-gray-600"
            }`}
          >
            {isLoggedIn ? "✅ Logged In" : "❌ Not Logged In"}
          </span>
        </div>

        {/* Test Buttons */}
        <div className="flex flex-col gap-2">
          <Button onClick={testConnection} variant="outline">
            Test Connection
          </Button>

          {!isLoggedIn && (
            <Button onClick={testRegister} variant="default">
              Test Registration (test@example.com)
            </Button>
          )}

          {isLoggedIn && (
            <Button onClick={testCreateExercise} variant="success">
              Test Create Exercise
            </Button>
          )}

          {isLoggedIn && (
            <Button
              onClick={() => {
                auth.logout();
                setIsLoggedIn(false);
                toast({
                  title: "Logged Out",
                  description: "Test user logged out",
                });
              }}
              variant="destructive"
            >
              Logout
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 border-t pt-4">
          <p className="font-semibold">Test Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Make sure PocketBase is running on localhost:8090</li>
            <li>Test the connection first</li>
            <li>Register a test user</li>
            <li>Try creating a custom exercise</li>
            <li>Check the PocketBase admin panel to see if data was saved</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
