import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const OnboardingRoute = () => {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>
            Welcome to Cal<span className="text-primary">Marshal</span>
          </CardTitle>
          <CardDescription>
            We need to following information to set up your profile
          </CardDescription>
        </CardHeader>
        <form>
          <CardContent className="grid gap-y-5">
            <div className="grid gap-y-2">
              <Label>Full Name</Label>
              <Input placeholder="Jahn Mershal" />
            </div>
            <div>
              <Label>Username</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-sm text-muted-foreground">
                  CalMarshal.com/
                </span>
                <Input
                  placeholder="example-user-1"
                  className="rounded-l-none"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button effect="gooeyLeft" className="w-full">
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default OnboardingRoute;
