<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import InteractiveExample from '$lib/components/docs/InteractiveExample.svelte';
	import CodeBlock from '$lib/components/ui/code-block.svelte';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { ShieldCheck, Eye, Users, Settings, AlertTriangle, CheckCircle } from '@lucide/svelte';
</script>

<DocPage title="Authorization Module" description="Biometric face verification for secure identity authentication">
	
	<div class="prose max-w-none">
		<p class="lead">
			The Authorization module is the core of Winter Auth, providing enterprise-grade face verification capabilities with configurable security levels, liveness detection, and anti-spoofing measures.
		</p>

		<h2>Security Levels</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4 my-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm">LOW (70%)</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-xs space-y-1">
						<li>Basic matching</li>
						<li>Faster processing</li>
						
					</div>
					<Badge variant="outline" class="mt-2">Development</Badge>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm">MEDIUM (80%)</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-xs space-y-1">
						<li>Balanced accuracy</li>
						<li>Good performance</li>
						<li>Recommended default</li>
					</div>
					<Badge variant="default" class="mt-2">Recommended</Badge>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm">HIGH (90%)</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-xs space-y-1">
						<li>High accuracy</li>
						<li>Lower false positives</li>
						<li>Stricter matching</li>
					</div>
					<Badge variant="default" class="mt-2">Production</Badge>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm">MAXIMUM (95%)</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-xs space-y-1">
						<li>Maximum security</li>
						<li>Minimal false positives</li>
						
					</div>
					<Badge variant="destructive" class="mt-2">Critical Systems</Badge>
				</Card.Content>
			</Card.Root>
		</div>

		<h2>Liveness Detection</h2>
		
		<p>Liveness detection ensures that the person being verified is physically present and not using a photo, video, or other spoofing method.</p>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Eye class="h-5 w-5 text-green-600" />
						Active Detection
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<ul class="text-sm space-y-1">
						<li>Head movement analysis</li>
						<li>Blink detection</li>
						<li>Facial micro-expressions</li>
						<li>Real-time processing</li>
					</ul>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<AlertTriangle class="h-5 w-5 text-red-600" />
						Spoof Prevention
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<ul class="text-sm space-y-1">
						<li>Photo detection</li>
						<li>Video replay prevention</li>
						<li>3D mask detection</li>
						<li>Screen reflection analysis</li>
					</ul>
				</Card.Content>
			</Card.Root>
		</div>

		<h2>Challenge System</h2>
		
		<p>Optional challenge system that requires users to perform specific actions to prove liveness and prevent spoofing attacks.</p>

		<div class="my-6">
			<CodeBlock 
				language="typescript" 
				code={`const result = await wauth.compareByLiveVideo(referenceImage, videoElement, {
  securityLevel: 'HIGH',
  enableLivenessCheck: true,
  enableChallenges: true // Enables head movement challenges
});

// Check challenge results
if (result.challenges) {
  result.challenges.forEach(challenge => {
    console.log(\`\${challenge.type}: \${challenge.isSuccessful ? 'PASS' : 'FAIL'}\`);
  });
}`} 
			/>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm">Look Left</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-xs space-y-1">
						<div>Head rotation detection</div>
						<div>Angle verification</div>
						<div>Natural movement</div>
					</div>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm">Look Right</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-xs space-y-1">
						<div>Opposite direction</div>
						<div>Continuous tracking</div>
						<div>Smooth motion</div>
					</div>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm">Validation</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-xs space-y-1">
						<div>Real-time feedback</div>
						<div>Success indicators</div>
						<div>Retry mechanisms</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<h2>Provider Support</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<CheckCircle class="h-5 w-5 text-green-600" />
						AWS Rekognition
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-sm space-y-2">
						<div><strong>Status:</strong> <Badge variant="default">Production Ready</Badge></div>
						<div><strong>Features:</strong> Face detection, comparison, quality analysis</div>
						<div><strong>Challenges:</strong> Not supported (AWS limitation)</div>
						<div><strong>Performance:</strong> Excellent global coverage</div>
					</div>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Settings class="h-5 w-5 text-blue-600" />
						Azure Face API
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-sm space-y-2">
						<div><strong>Status:</strong> <Badge variant="secondary">Planned</Badge></div>
						<div><strong>Features:</strong> Advanced face analysis</div>
						<div><strong>Challenges:</strong> Supported</div>
						<div><strong>Performance:</strong> High accuracy</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- <h2>Response Format</h2>

		<div class="my-6">
			<CodeBlock 
				language="typescript" 
				code={`interface VerificationResult {
  verified: boolean;
  similarity: number; // 0-1 scale
  similarityPercent: number; // 0-100 scale
  confidence: number;
  status: string;
  
  // Liveness detection results
  livenessResult?: {
    isLive: boolean;
    confidence: number;
    details?: {
      spoofIndicators?: string[];
      livenessScore?: number;
    };
  };
  
  // Challenge results
  challenges?: Array<{
    type: 'look_left' | 'look_right';
    isSuccessful: boolean;
    confidence: number;
  }>;
  
  // Processing metadata
  framesAnalyzed?: number;
  processingTime?: number;
  qualityIssues?: string[];
  recommendations?: string[];
}`} 
			/>
		</div> -->

		<h2>Best Practices</h2>

		<ul class="space-y-2">
			<li><strong>Security Level Selection:</strong> Use MEDIUM for most applications, HIGH for sensitive data</li>
			<li><strong>Image Quality:</strong> Always check image quality before comparison</li>
			<li><strong>Liveness Detection:</strong> Enable for any user-facing verification</li>
			<li><strong>Challenge System:</strong> Use for high-security scenarios or suspicious activity</li>
			<li><strong>Error Handling:</strong> Implement proper fallback mechanisms for failed verifications</li>
			<li><strong>Performance:</strong> Reuse Winter Auth instances to avoid initialization overhead</li>
		</ul>
	</div>
</DocPage>

