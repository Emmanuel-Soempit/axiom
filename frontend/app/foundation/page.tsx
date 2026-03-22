import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import { Heading, Text } from '@/shared/components/Typography';

export default function Foundation() {
    return (
        <main className="min-h-screen p-8 space-y-12">
            <section className="space-y-6">
                <Heading variant="hero" as="h1">EAC Foundation Verified</Heading>
                <Text variant="lg" className="max-w-2xl">
                    This is a verification page to ensure all extracted styles and components
                    match the mockup design.
                </Text>
            </section>

            <section className="space-y-8">
                <Heading variant="section">Buttons</Heading>
                <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="primary" size="lg">Get Started Free</Button>
                    <Button variant="white" size="lg">View Documentation</Button>
                    <Button variant="secondary">Secondary Action</Button>
                    <Button variant="outline">Outline Action</Button>
                    <Button variant="ghost">Ghost link</Button>
                </div>
            </section>

            <section className="space-y-8">
                <Heading variant="section">Cards</Heading>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card hoverable className="space-y-4">
                        <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center">
                            <span className="material-symbols-outlined">code</span>
                        </div>
                        <Heading variant="card" as="h3">Structured Actions</Heading>
                        <Text variant="sm">
                            Converts loose natural language prompts into validated, schema-compliant application commands.
                        </Text>
                    </Card>

                    <Card hoverable className="space-y-4 text-center">
                        <div className="inline-flex h-12 w-12 rounded-xl bg-secondary text-white items-center justify-center">
                            <span className="material-symbols-outlined">shield</span>
                        </div>
                        <Heading variant="card" as="h3">Policy Enforcement</Heading>
                        <Text variant="sm">
                            Define granular rules on what actions can be performed, by whom, and under what conditions.
                        </Text>
                    </Card>

                    <Card hoverable className="space-y-4">
                        <div className="h-12 w-12 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
                            <span className="material-symbols-outlined">bolt</span>
                        </div>
                        <Heading variant="card" as="h3">Deterministic Execution</Heading>
                        <Text variant="sm">
                            Eliminate AI "hallucinations" in your business logic by ensuring only pre-approved code paths.
                        </Text>
                    </Card>
                </div>
            </section>

            <section className="space-y-8">
                <Heading variant="section">Typography</Heading>
                <div className="space-y-4">
                    <Heading variant="hero">Hero Heading</Heading>
                    <Heading variant="section">Section Heading</Heading>
                    <Heading variant="card">Card Heading</Heading>
                    <Text variant="lg">Large leading text for introductions.</Text>
                    <Text variant="md">Standard medium text for body content.</Text>
                    <Text variant="sm">Small text for secondary information.</Text>
                    <Text variant="xs">Uppercase label or badge style.</Text>
                </div>
            </section>
        </main>
    );
}
