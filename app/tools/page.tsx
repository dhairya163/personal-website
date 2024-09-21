import PageContainer from "@/components/page-container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import Newsletter from "@/plugins/newsletter"
import type { Metadata } from "next"
import { getMetadata } from "@/lib/utils"

export const metadata: Metadata = getMetadata("tools")

const tools = [
  {
    id: 1,
    name: "LinkedIn Profile to Resume",
    description: "Convert your LinkedIn profile to a resume",
    link: "/tools/linkedin-profile-to-resume",
  },
//   {
//     id: 2,
//     name: "Tech Stack Analyzer",
//     description: "Analyze and optimize your technology stack",
//     link: "/tools/tech-stack-analyzer",
//   },
//   {
//     id: 3,
//     name: "ML Model Playground",
//     description: "Experiment with various machine learning models",
//     link: "/tools/ml-model-playground",
//   },
//   {
//     id: 4,
//     name: "API Testing Suite",
//     description: "Comprehensive tool for testing and debugging APIs",
//     link: "/tools/api-testing-suite",
//   },
]

const Tools = () => {
  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Card key={tool.id}>
              <CardHeader>
                <CardTitle>{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild variant="secondary" className="w-full">
                  <Link href={tool.link} className="flex items-center justify-center">
                    Try it <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <Newsletter />
      </div>
    </PageContainer>
  )
}

export default Tools
