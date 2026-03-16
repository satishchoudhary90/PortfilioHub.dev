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

export default function ExecutiveResume({
  data,
  editable,
  onEdit,
}: ResumeProps) {
  if (!data) return null;

  return (
    <div
      className="w-[794px] min-h-[1123px] mx-auto shadow-2xl bg-white text-gray-900 font-serif"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {/* Header — dark navy with white text, gold accents */}
      <div
        className="px-12 py-10 text-white"
        style={{ backgroundColor: "#1e293b" }}
      >
        <h1 className="text-3xl font-light tracking-wide">
          <EditableText
            value={data.name}
            field="name"
            editable={editable}
            onEdit={onEdit}
            tag="span"
          />
        </h1>
        <div
          className="h-px my-4"
          style={{ backgroundColor: "#B8860B", width: "80px" }}
        />
        <p className="text-lg font-light text-white/90">
          <EditableText
            value={data.headline}
            field="headline"
            editable={editable}
            onEdit={onEdit}
            tag="span"
          />
        </p>
        <div className="flex flex-wrap gap-6 mt-6 text-sm text-white/80">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.website && <span>{data.website}</span>}
        </div>
      </div>

      <div className="px-12 py-8 space-y-8">
        {/* Bio */}
        {(data.bio || editable) && (
          <section>
            <h2
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#B8860B" }}
            >
              Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
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

        {/* Experience */}
        {data.experiences?.length > 0 && (
          <section>
            <h2
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#B8860B" }}
            >
              Experience
            </h2>
            <div className="space-y-6">
              {data.experiences.map((exp: any) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(exp.startDate)} —{" "}
                      {exp.current
                        ? "Present"
                        : exp.endDate
                          ? formatDate(exp.endDate)
                          : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  {exp.description && (
                    <p className="text-sm text-gray-600 leading-relaxed mt-2">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.educations?.length > 0 && (
          <section>
            <h2
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#B8860B" }}
            >
              Education
            </h2>
            <div className="space-y-5">
              {data.educations.map((edu: any) => (
                <div key={edu.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree}
                      {edu.field ? `, ${edu.field}` : ""}
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
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <section>
            <h2
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#B8860B" }}
            >
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((proj: any) => (
                <div key={proj.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-900">{proj.title}</h3>
                    <div className="flex gap-3 text-xs" style={{ color: "#B8860B" }}>
                      {proj.githubUrl && <a href={proj.githubUrl} className="hover:underline">GitHub</a>}
                      {proj.liveUrl && <a href={proj.liveUrl} className="hover:underline">Live</a>}
                    </div>
                  </div>
                  {proj.description && <p className="text-sm text-gray-600">{proj.description}</p>}
                  {proj.techStack?.length > 0 && (
                    <p className="text-xs text-gray-500">{proj.techStack.join(" · ")}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills — horizontal with gold dots */}
        {data.skills?.length > 0 && (
          <section>
            <h2
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#B8860B" }}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {data.skills.map((skill: any, i: number) => (
                <span key={skill.id} className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "#B8860B" }}
                  />
                  <span className="text-sm text-gray-700">{skill.name}</span>
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
