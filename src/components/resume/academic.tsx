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
      onBlur={(e: any) =>
        editable && onEdit?.(field, e.currentTarget.textContent || "")
      }
    >
      {value || (editable ? "Click to edit" : "")}
    </Tag>
  );
}

export default function AcademicResume({
  data,
  editable,
  onEdit,
}: ResumeProps) {
  if (!data) return null;

  return (
    <div
      className="w-[794px] min-h-[1123px] mx-auto shadow-2xl bg-white text-gray-900 p-10 font-serif"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Contact */}
      <div className="text-center mb-8">
        <div className="flex flex-col items-center gap-3">
          {data.image && (
            <img src={data.image} alt="" className="w-14 h-14 rounded-full object-cover border border-gray-200 shadow-sm" />
          )}
          <h1 className="text-2xl font-bold">
            <EditableText
              value={data.name}
              field="name"
              editable={editable}
              onEdit={onEdit}
              tag="span"
            />
          </h1>
          <p className="mt-1 text-base">
            <EditableText
              value={data.headline}
              field="headline"
              editable={editable}
              onEdit={onEdit}
              tag="span"
            />
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-3 text-sm text-gray-600">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.location && <span>{data.location}</span>}
            {data.website && <span>{data.website}</span>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Research Interests / Bio */}
        {(data.bio || editable) && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wide pb-2 mb-3 border-b-2 text-left"
              style={{ borderColor: "#1e40af", color: "#1e40af" }}
            >
              Research Interests
            </h2>
            <p className="text-sm text-gray-800 leading-relaxed">
              <EditableText
                value={data.bio}
                field="bio"
                editable={editable}
                onEdit={onEdit}
                tag="span"
              />
            </p>
          </section>
        )}

        {/* Publications-style Experience */}
        {data.experiences?.length > 0 && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wide pb-2 mb-3 border-b-2 text-left"
              style={{ borderColor: "#1e40af", color: "#1e40af" }}
            >
              Professional Experience
            </h2>
            <div className="space-y-4">
              {data.experiences.map((exp: any) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-900">
                      {exp.position} — {exp.company}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(exp.startDate)} —{" "}
                      {exp.current
                        ? "Present"
                        : exp.endDate
                          ? formatDate(exp.endDate)
                          : ""}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education — institution emphasis */}
        {data.educations?.length > 0 && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wide pb-2 mb-3 border-b-2 text-left"
              style={{ borderColor: "#1e40af", color: "#1e40af" }}
            >
              Education
            </h2>
            <div className="space-y-4">
              {data.educations.map((edu: any) => (
                <div key={edu.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-900">
                      {edu.institution}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(edu.startDate)} —{" "}
                      {edu.current
                        ? "Present"
                        : edu.endDate
                          ? formatDate(edu.endDate)
                          : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {edu.degree}
                    {edu.field ? ` in ${edu.field}` : ""}
                    {edu.grade ? ` — ${edu.grade}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wide pb-2 mb-3 border-b-2 text-left"
              style={{ borderColor: "#1e40af", color: "#1e40af" }}
            >
              Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((proj: any) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-900">{proj.title}</h3>
                    <div className="flex gap-2 text-xs" style={{ color: "#1e40af" }}>
                      {proj.githubUrl && <a href={proj.githubUrl} className="hover:underline">GitHub</a>}
                      {proj.liveUrl && <a href={proj.liveUrl} className="hover:underline">Live</a>}
                    </div>
                  </div>
                  {proj.description && <p className="text-sm text-gray-700 mt-0.5">{proj.description}</p>}
                  {proj.techStack?.length > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">{proj.techStack.join(" · ")}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills — categorized list */}
        {data.skills?.length > 0 && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wide pb-2 mb-3 border-b-2 text-left"
              style={{ borderColor: "#1e40af", color: "#1e40af" }}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: any) => (
                <span
                  key={skill.id}
                  className="text-sm text-gray-800 px-2 py-0.5 bg-gray-50"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
