interface NavBarProps {
    items: { id: string; label: string }[];
    activeId: string;
    onNavigate: (id: string) => void;
    rightSlot?: React.ReactNode;
}

export function NavBar({ items, activeId, onNavigate, rightSlot }: NavBarProps) {
    return (
        <nav className="bg-blue text-primary-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between gap-6">
                <ul className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                    {items.map((item) => {
                        const isActive = item.id === activeId;
                        return (
                            <li key={item.id}>
                                <button
                                    type="button"
                                    onClick={() => onNavigate(item.id)}
                                    className={`relative px-3 sm:px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                                        isActive
                                            ? 'text-primary-foreground'
                                            : 'text-primary-foreground/70 hover:text-primary-foreground'
                                    }`}
                                >
                                    {item.label}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-foreground rounded-full" />
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
                {rightSlot && <div className="flex-none">{rightSlot}</div>}
            </div>
        </nav>
    );
}