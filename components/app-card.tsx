import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AppCardProps {
  name: string;
  description: string;
  icon: string;
  url: string;
  framework?: string;
  language?: string;
}

export function AppCard({
  name,
  description,
  icon,
  url,
  framework,
  language,
}: AppCardProps) {
  return (
    <Link href={url} className="group">
      <Card className="h-full overflow-hidden transition-all hover:border-blue-500/50 hover:shadow-md">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
              {icon.startsWith("/app-icons/") ? (
                <div className="text-blue-500 flex items-center justify-center h-8 w-8">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              ) : (
                <Image src={icon} alt={name} width={48} height={48} />
              )}
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-1">
            {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow mb-4">
            {description}
          </p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {framework && (
              <Badge variant="outline" className="text-xs font-normal">
                {framework}
              </Badge>
            )}
            {language && (
              <Badge variant="outline" className="text-xs font-normal">
                {language}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
