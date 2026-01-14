import { Dumbbell, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Workouts() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Workouts
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse and manage workout templates
          </p>
        </div>
        <Button size="lg" className="h-14 px-6">
          <Plus className="w-5 h-5 mr-2" />
          Create
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search workouts..."
          className="pl-10 h-14 text-lg"
        />
      </div>

      {/* Workout Templates Placeholder */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Workout Templates</CardTitle>
          <CardDescription>
            Saved workout routines and templates
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Dumbbell className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground mb-2">No Templates Yet</p>
          <p className="text-sm text-muted-foreground text-center">
            Create your first workout template to get started
          </p>
          <Button size="lg" className="mt-4 h-14 px-8">
            <Plus className="w-5 h-5 mr-2" />
            Create Template
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-1">Templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-1">
              Custom Exercises
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-1">Favorites</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-1">Recent</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
