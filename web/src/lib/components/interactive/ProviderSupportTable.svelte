<script lang="ts">
interface Props {
	provider?: string;
}

let { provider = 'aws' }: Props = $props();

const supportMatrix = [
  {
    feature: 'Face Verification',
    aws: true,
    azure: true,
    kairos: true
  },
  {
    feature: 'Image Quality Analysis',
    aws: true,
    azure: true,
    kairos: true
  },
  {
    feature: 'Liveness Detection',
    aws: false, // Only basic motion, not true challenge-based
    azure: true, // Azure Face API supports liveness
    kairos: false
  },
  {
    feature: 'Challenge-based Liveness',
    aws: false,
    azure: true, // Azure supports challenge/pose
    kairos: false
  },
  {
    feature: 'Head Pose/Angle',
    aws: true,
    azure: true,
    kairos: true
  }
];

const providerLabels = {
  aws: 'AWS Rekognition',
  azure: 'Azure Face API',
  kairos: 'Kairos'
};
</script>

<div class="rounded-md border bg-muted/40 p-4 mb-4">
  <div class="flex items-center gap-2 mb-2">
    <span class="font-semibold">Current Provider:</span>
    <span class="px-2 py-1 rounded bg-primary/10 text-primary font-mono text-xs">{providerLabels[provider] || provider}</span>
  </div>
  <div class="text-xs text-muted-foreground mb-2">
    The table below shows which features are supported by each provider. Some features (like challenge-based liveness) are not available on AWS Rekognition.
  </div>
  <div class="overflow-x-auto">
    <table class="min-w-[400px] text-xs border-collapse">
      <thead>
        <tr>
          <th class="text-left p-2 font-semibold">Feature</th>
          <th class="p-2 font-semibold">AWS</th>
          <th class="p-2 font-semibold">Azure</th>
          <th class="p-2 font-semibold">Kairos</th>
        </tr>
      </thead>
      <tbody>
        {#each supportMatrix as row}
          <tr>
            <td class="p-2">{row.feature}</td>
            <td class="p-2 text-center">{row.aws ? '✅' : '❌'}</td>
            <td class="p-2 text-center">{row.azure ? '✅' : '❌'}</td>
            <td class="p-2 text-center">{row.kairos ? '✅' : '❌'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
