"use client";

import { formatDate } from "@/lib/utils";

interface ResumeProps {
  data: any;
  editable?: boolean;
  onEdit?: (field: string, value: string) => void;
}

function EditableText({
  value,
  field,
  editable,
  onEdit,
  className,
  tag: Tag = "span",
}: {
  value: string;
  field: string;
  editable?: boolean;
  onEdit?: (field: string, value: string) => void;
  className?: string;
  tag?: any;
}) {
  if (!value && !editable) return null;
  return (
    <Tag
      className={`${className || ""} ${editable ? "outline-none ring-1 ring-transparent hover:ring-indigo-400/50 focus:ring-indigo-500 rounded px-0.5 cursor-text" : ""}`}
      contentEditable={editable}
      suppressContentEditableWarning
      onBlur={(e: any) => editable && onEdit?.(field, e.currentTarget.textContent || "")}
    >
      {value || (editable ? "Click to edit" : "")}
    </Tag>
  );
}

export default function CompactResume({ data, editable, onEdit }: ResumeProps) {
  if (!data) return null;

  return (
    <div className="w-[794px] min-h-[1123px] mx-auto shadow-2xl bg-white p-6 text-xs">
      {/* Header: name, headline, two-column contact + skills */}
      <div className="border-b border-gray-300 pb-3 mb-3">
        <div className="flex items-center gap-3">
          {data.image && (
            <img src={data.image} alt="" className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm shrink-0" />
          )}
          <div className="flex-1">
            <h1 className="text-sm font-bold text-gray-900 leading-tight">
              <EditableText value={data.name} field="name" editable={editable} onEdit={onEdit} tag="span" />
            </h1>
            <p className="text-gray-600 mt-0.5">
              <EditableText value={data.headline} field="headline" editable={editable} onEdit={onEdit} tag="span" />
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
          <div className="space-y-0.5">
            {data.email && <div className="text-gray-700">{data.email}</div>}
            {data.phone && <div className="text-gray-700">{data.phone}</div>}
            {data.location && <div className="text-gray-700">{data.location}</div>}
          </div>
          <div>
            {data.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill: any) => (
                  <span key={skill.id} className="text-gray-600">
                    {skill.name}{" "}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {(data.bio || editable) && (
        <section className="mb-3">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#374151] mb-1.5">Summary</h2>
          <div className="border-b border-gray-200 pb-3">
            <p className="text-gray-700 leading-relaxed">
              <EditableText value={data.bio} field="bio" editable={editable} onEdit={onEdit} tag="span" />
            </p>
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experiences?.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#374151] mb-1.5">Experience</h2>
          <div className="border-b border-gray-200 pb-3 space-y-2">
            {data.experiences.map((exp: any) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-semibold text-gray-900">{exp.position}</span>
                  <span className="text-gray-500 shrink-0">
                    {formatDate(exp.startDate)} — {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                  </span>
                </div>
                <p className="text-gray-600">{exp.company}</p>
                {exp.description && <p className="text-gray-600 mt-0.5 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#374151] mb-1.5">Projects</h2>
          <div className="border-b border-gray-200 pb-3 space-y-2">
            {data.projects.map((proj: any) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-semibold text-gray-900">{proj.title}</span>
                  <div className="flex gap-2 text-gray-500 shrink-0">
                    {proj.githubUrl && <a href={proj.githubUrl} className="hover:underline">GitHub</a>}
                    {proj.liveUrl && <a href={proj.liveUrl} className="hover:underline">Live</a>}
                  </div>
                </div>
                {proj.description && <p className="text-gray-600">{proj.description}</p>}
                {proj.techStack?.length > 0 && (
                  <p className="text-gray-500">{proj.techStack.join(" · ")}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.educations?.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#374151] mb-1.5">Education</h2>
          <div className="border-b border-gray-200 pb-3 space-y-2">
            {data.educations.map((edu: any) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-semibold text-gray-900">
                    {edu.degree}
                    {edu.field ? `, ${edu.field}` : ""}
                  </span>
                  <span className="text-gray-500 shrink-0">
                    {formatDate(edu.startDate)} — {edu.current ? "Present" : edu.endDate ? formatDate(edu.endDate) : ""}
                  </span>
                </div>
                <p className="text-gray-600">{edu.institution}</p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
