import toast from "react-hot-toast"

export const comingSoonToast = (title:string) => {

    return toast.custom((t) => (
        <div
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border border-amber-200 bg-white px-4 py-3 shadow-lg transition-all ${t.visible ? 'animate-in slide-in-from-top-2 fade-in duration-200' : 'animate-out slide-out-to-top-2 fade-out duration-150'}`}
        >
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700" >
                <span className="material-symbols-outlined text-lg" > schedule </span>
            </div>
            < div className="pr-2" >
                <p className="text-sm font-semibold text-slate-800" > {title} </p>
                < p className="text-xs text-slate-500" > Coming soon...</p>
            </div>
            < button
                type="button"
                onClick={() => toast.dismiss(t.id)}
                className="ml-auto rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Dismiss notification"
            >
                <span className="material-symbols-outlined text-base" > close </span>
            </button>
        </div >
    ), { duration: 5000 })
}
